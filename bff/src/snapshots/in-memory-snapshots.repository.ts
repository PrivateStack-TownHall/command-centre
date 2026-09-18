import { SnapshotsRepository } from "./snapshots.repository";
import {
  emptySnapshotData,
  type AppSnapshotData,
  type HealthCheckRecord,
  type SectionErrors,
  type SnapshotRecord,
  type UptimeCount,
} from "./snapshot.types";

/** Test double with the same rules as the Prisma repository. */
export class InMemorySnapshotsRepository extends SnapshotsRepository {
  readonly records = new Map<string, SnapshotRecord>();
  readonly healthChecks: Array<HealthCheckRecord & { appId: string }> = [];

  constructor(readonly now: () => Date = () => new Date()) {
    super();
  }

  async findAll(): Promise<SnapshotRecord[]> {
    return [...this.records.values()].map((record) => structuredClone(record));
  }

  async tryAcquireRefreshLock(appId: string, lockSeconds: number): Promise<boolean> {
    const now = this.now();
    const record = this.records.get(appId);

    if (
      record?.refreshStartedAt &&
      now.getTime() - record.refreshStartedAt.getTime() < lockSeconds * 1000
    ) {
      return false;
    }

    this.records.set(appId, {
      appId,
      data: record?.data ?? emptySnapshotData(),
      errors: record?.errors ?? {},
      fetchedAt: record?.fetchedAt ?? null,
      refreshStartedAt: now,
    });

    return true;
  }

  async saveRefreshResult(
    appId: string,
    data: AppSnapshotData,
    errors: SectionErrors,
    fetchedAt: Date,
  ): Promise<void> {
    this.records.set(appId, { appId, data, errors, fetchedAt, refreshStartedAt: null });
  }

  async releaseRefreshLock(appId: string): Promise<void> {
    const record = this.records.get(appId);

    if (record) record.refreshStartedAt = null;
  }

  async recordHealthCheck(
    appId: string,
    check: Omit<HealthCheckRecord, "checkedAt">,
  ): Promise<void> {
    this.healthChecks.push({ appId, ...check, checkedAt: this.now() });
  }

  async countHealthChecksSince(since: Date): Promise<Map<string, UptimeCount>> {
    const counts = new Map<string, UptimeCount>();

    for (const check of this.healthChecks) {
      if (check.checkedAt < since) continue;

      const current = counts.get(check.appId) ?? { total: 0, up: 0 };

      counts.set(check.appId, {
        total: current.total + 1,
        up: current.up + (check.status === "UP" ? 1 : 0),
      });
    }

    return counts;
  }

  async findHealthChecks(appId: string, since: Date): Promise<HealthCheckRecord[]> {
    return this.healthChecks
      .filter((check) => check.appId === appId && check.checkedAt >= since)
      .map(({ appId: _appId, ...check }) => check);
  }

  async deleteHealthChecksBefore(before: Date): Promise<number> {
    const kept = this.healthChecks.filter((check) => check.checkedAt >= before);
    const removed = this.healthChecks.length - kept.length;

    this.healthChecks.length = 0;
    this.healthChecks.push(...kept);

    return removed;
  }

  async ping(): Promise<boolean> {
    return true;
  }
}
