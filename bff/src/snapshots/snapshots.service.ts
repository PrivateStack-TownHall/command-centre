import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { ResolvedApplication } from "../config/applications.config";
import type { AppEnv } from "../config/env.validation";
import { APPLICATIONS_TOKEN, CLOCK_TOKEN, type Clock } from "../config/tokens";
import { ApplicationSourceService } from "../sources/application-source.service";

import { SnapshotsRepository } from "./snapshots.repository";
import {
  emptySnapshotData,
  type AppSnapshotData,
  type SectionErrors,
  type SnapshotFreshness,
  type SnapshotRecord,
} from "./snapshot.types";

export interface AppSnapshotView extends AppSnapshotData {
  id: string;
  name: string;
  emoji: string;
  group: string;
  deployed: boolean;
  freshness: SnapshotFreshness;
  /** A refresh is running right now; newer data will follow. */
  refreshing: boolean;
  fetchedAt: string | null;
  ageSeconds: number | null;
  errors: SectionErrors;
}

export interface ManualRefreshResult {
  appId: string;
  accepted: boolean;
  reason?: "not-deployed" | "too-recent" | "unknown-application";
}

/** History older than this is deleted at most once per hour. */
const PRUNE_EVERY_MS = 60 * 60 * 1000;

/**
 * Stale-while-revalidate over stored snapshots:
 *  - reads always answer immediately from the database;
 *  - apps whose snapshot is older than the TTL (or missing) are refreshed in
 *    the background, one refresh per app at a time;
 *  - nothing refreshes while nobody is looking, so sleeping backends are only
 *    woken when the dashboard is actually used.
 */
@Injectable()
export class SnapshotsService {
  readonly logger = new Logger(SnapshotsService.name);

  /** Refreshes running in this instance, so one page load starts one each. */
  readonly inFlight = new Map<string, Promise<void>>();

  readonly ttlSeconds: number;
  readonly lockSeconds: number;
  readonly manualRefreshMinSeconds: number;
  readonly latestItemsLimit: number;
  readonly historyRetentionDays: number;

  lastPrunedAt = 0;

  constructor(
    readonly repository: SnapshotsRepository,
    readonly source: ApplicationSourceService,
    config: ConfigService<AppEnv, true>,
    @Inject(APPLICATIONS_TOKEN) readonly applications: ResolvedApplication[],
    @Inject(CLOCK_TOKEN) readonly clock: Clock,
  ) {
    this.ttlSeconds = config.get("SNAPSHOT_TTL_SECONDS", { infer: true });
    this.lockSeconds = config.get("REFRESH_LOCK_SECONDS", { infer: true });
    this.manualRefreshMinSeconds = config.get("MANUAL_REFRESH_MIN_SECONDS", {
      infer: true,
    });
    this.latestItemsLimit = config.get("LATEST_ITEMS_LIMIT", { infer: true });
    this.historyRetentionDays = config.get("HEALTH_HISTORY_RETENTION_DAYS", {
      infer: true,
    });
  }

  /** Every application's snapshot, refreshing the stale ones in the background. */
  async getSnapshots(): Promise<AppSnapshotView[]> {
    const records = await this.findRecords();
    const now = this.clock();

    return this.applications.map((app) => {
      const record = records.get(app.id);
      const freshness = this.freshnessOf(app, record, now);

      if (freshness === "stale" || freshness === "missing") {
        this.refreshInBackground(app);
      }

      return this.toView(app, record, freshness, now);
    });
  }

  /** Refresh on request (e.g. a "Refresh now" button), rate-limited per app. */
  async requestRefresh(appId?: string): Promise<ManualRefreshResult[]> {
    const targets = appId
      ? this.applications.filter((app) => app.id === appId)
      : this.applications;

    if (appId && targets.length === 0) {
      return [{ appId, accepted: false, reason: "unknown-application" }];
    }

    const records = await this.findRecords();
    const now = this.clock().getTime();

    return targets.map((app) => {
      if (!app.deployed) {
        return { appId: app.id, accepted: false, reason: "not-deployed" };
      }

      const fetchedAt = records.get(app.id)?.fetchedAt;
      const tooRecent =
        fetchedAt &&
        now - fetchedAt.getTime() < this.manualRefreshMinSeconds * 1000;

      if (tooRecent) {
        return { appId: app.id, accepted: false, reason: "too-recent" };
      }

      this.refreshInBackground(app);

      return { appId: app.id, accepted: true };
    });
  }

  /** Resolves once every background refresh started so far has finished. */
  async waitForRefreshes(): Promise<void> {
    while (this.inFlight.size > 0) {
      await Promise.allSettled([...this.inFlight.values()]);
    }
  }

  async findRecords(): Promise<Map<string, SnapshotRecord>> {
    const records = await this.repository.findAll();

    return new Map(records.map((record) => [record.appId, record]));
  }

  freshnessOf(
    app: ResolvedApplication,
    record: SnapshotRecord | undefined,
    now: Date,
  ): SnapshotFreshness {
    if (!app.deployed) return "not-deployed";
    if (!record?.fetchedAt) return "missing";

    const ageMs = now.getTime() - record.fetchedAt.getTime();

    return ageMs > this.ttlSeconds * 1000 ? "stale" : "fresh";
  }

  refreshInBackground(app: ResolvedApplication) {
    if (this.inFlight.has(app.id)) return;

    const task = this.refresh(app)
      .catch((error: unknown) =>
        this.logger.error(`Refreshing ${app.id} failed`, error as Error),
      )
      .finally(() => this.inFlight.delete(app.id));

    this.inFlight.set(app.id, task);
  }

  async refresh(app: ResolvedApplication): Promise<void> {
    const acquired = await this.repository.tryAcquireRefreshLock(
      app.id,
      this.lockSeconds,
    );

    if (!acquired) return;

    try {
      const records = await this.findRecords();
      const previous = records.get(app.id)?.data ?? emptySnapshotData();

      const { data, errors } = await this.source.collect(
        app,
        previous,
        this.latestItemsLimit,
      );

      await this.repository.saveRefreshResult(
        app.id,
        data,
        errors,
        this.clock(),
      );

      if (data.health) {
        await this.repository.recordHealthCheck(app.id, {
          status: data.health.status,
          reachable: data.health.reachable,
          latencyMs: data.health.latencyMs,
        });
      }

      const failed = Object.keys(errors);

      if (failed.length > 0) {
        this.logger.warn(
          `${app.id}: refreshed with errors in ${failed.join(", ")}`,
        );
      }

      await this.pruneHistory();
    } catch (error) {
      await this.repository.releaseRefreshLock(app.id);
      throw error;
    }
  }

  /** Keeps the history table small; runs at most once an hour. */
  async pruneHistory(): Promise<void> {
    const now = this.clock().getTime();

    if (now - this.lastPrunedAt < PRUNE_EVERY_MS) return;

    this.lastPrunedAt = now;

    const before = new Date(
      now - this.historyRetentionDays * 24 * 60 * 60 * 1000,
    );
    const removed = await this.repository.deleteHealthChecksBefore(before);

    if (removed > 0) {
      this.logger.log(
        `Removed ${removed} health checks older than ${this.historyRetentionDays} days`,
      );
    }
  }

  toView(
    app: ResolvedApplication,
    record: SnapshotRecord | undefined,
    freshness: SnapshotFreshness,
    now: Date,
  ): AppSnapshotView {
    const data = record?.data ?? emptySnapshotData();
    const lockAgeMs = record?.refreshStartedAt
      ? now.getTime() - record.refreshStartedAt.getTime()
      : null;

    return {
      id: app.id,
      name: app.name,
      emoji: app.emoji,
      group: app.group,
      deployed: app.deployed,
      freshness,
      refreshing:
        this.inFlight.has(app.id) ||
        (lockAgeMs !== null && lockAgeMs < this.lockSeconds * 1000),
      fetchedAt: record?.fetchedAt?.toISOString() ?? null,
      ageSeconds: record?.fetchedAt
        ? Math.round((now.getTime() - record.fetchedAt.getTime()) / 1000)
        : null,
      errors: record?.errors ?? {},
      health: data.health,
      stats: data.stats,
      monitoring: data.monitoring,
      activities: data.activities,
      reviews: data.reviews,
      orders: data.orders,
    };
  }
}
