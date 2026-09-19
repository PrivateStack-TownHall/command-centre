import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import type { AppEnv } from "../config/env.validation";
import { SnapshotsRepository } from "../snapshots/snapshots.repository";
import { SnapshotsService } from "../snapshots/snapshots.service";

import { averageLatency, uptimePercent } from "./uptime";

export type MonitoringState = "online" | "offline" | "unknown" | "not-deployed";

@Injectable()
export class MonitoringService {
  readonly uptimeWindowHours: number;

  constructor(
    readonly snapshots: SnapshotsService,
    readonly repository: SnapshotsRepository,
    config: ConfigService<AppEnv, true>,
  ) {
    this.uptimeWindowHours = config.get("UPTIME_WINDOW_HOURS", { infer: true });
  }

  /** Health of every application, with uptime over the configured window. */
  async getMonitoring() {
    const views = await this.snapshots.getSnapshots();
    const since = this.hoursAgo(this.uptimeWindowHours);
    const counts = await this.repository.countHealthChecksSince(since);

    const applications = views.map((app) => ({
      id: app.id,
      name: app.name,
      emoji: app.emoji,
      group: app.group,
      state: stateOf(app),
      health: app.health,
      uptimePercent: uptimePercent(counts.get(app.id)),
      checksCounted: counts.get(app.id)?.total ?? 0,
      freshness: app.freshness,
      refreshing: app.refreshing,
      fetchedAt: app.fetchedAt,
      ageSeconds: app.ageSeconds,
      error: app.errors.health ?? null,
    }));

    const count = (state: MonitoringState) =>
      applications.filter((app) => app.state === state).length;

    return {
      generatedAt: new Date().toISOString(),
      uptimeWindowHours: this.uptimeWindowHours,
      summary: {
        total: applications.length,
        online: count("online"),
        offline: count("offline"),
        unknown: count("unknown"),
        notDeployed: count("not-deployed"),
      },
      applications,
    };
  }

  /** Stored health checks of one application, for an uptime/latency chart. */
  async getHistory(appId: string, hours: number) {
    const app = this.snapshots.applications.find((item) => item.id === appId);

    if (!app) {
      const known = this.snapshots.applications.map((item) => item.id).join(", ");

      throw new NotFoundException(`Unknown application "${appId}". Known: ${known}`);
    }

    const since = this.hoursAgo(hours);
    const checks = await this.repository.findHealthChecks(appId, since);

    return {
      id: app.id,
      name: app.name,
      emoji: app.emoji,
      since: since.toISOString(),
      hours,
      uptimePercent: uptimePercent({
        total: checks.length,
        up: checks.filter((check) => check.status === "UP").length,
      }),
      averageLatencyMs: averageLatency(checks.map((check) => check.latencyMs)),
      checks: checks.map((check) => ({
        status: check.status,
        reachable: check.reachable,
        latencyMs: check.latencyMs,
        checkedAt: check.checkedAt.toISOString(),
      })),
    };
  }

  /** An app id to show in error messages and examples. */
  exampleAppId(): string {
    const deployed = this.snapshots.applications.find((app) => app.deployed);

    return deployed?.id ?? this.snapshots.applications[0]?.id ?? "kings-brew";
  }

  hoursAgo(hours: number): Date {
    return new Date(Date.now() - hours * 60 * 60 * 1000);
  }
}

function stateOf(app: { deployed: boolean; health: { status: string } | null }): MonitoringState {
  if (!app.deployed) return "not-deployed";
  if (!app.health) return "unknown";

  return app.health.status === "UP" ? "online" : "offline";
}
