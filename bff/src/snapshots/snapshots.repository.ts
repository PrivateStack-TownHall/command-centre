import type {
  AppSnapshotData,
  HealthCheckRecord,
  SectionErrors,
  SnapshotRecord,
  UptimeCount,
} from "./snapshot.types";

/**
 * Storage for snapshots and health history. The Prisma implementation is used
 * in the app; the in-memory one in tests.
 */
export abstract class SnapshotsRepository {
  abstract findAll(): Promise<SnapshotRecord[]>;

  /**
   * Atomically marks a refresh as started. Returns false when another refresh
   * of the same app started less than `lockSeconds` ago — so many visitors,
   * or several BFF instances, never refresh the same backend at once.
   */
  abstract tryAcquireRefreshLock(appId: string, lockSeconds: number): Promise<boolean>;

  /** Stores a refresh result and releases the lock. */
  abstract saveRefreshResult(
    appId: string,
    data: AppSnapshotData,
    errors: SectionErrors,
    fetchedAt: Date,
  ): Promise<void>;

  abstract releaseRefreshLock(appId: string): Promise<void>;

  /** Appends one health check to the history. */
  abstract recordHealthCheck(
    appId: string,
    check: Omit<HealthCheckRecord, "checkedAt">,
  ): Promise<void>;

  /** Checks per application since a point in time, for uptime percentages. */
  abstract countHealthChecksSince(since: Date): Promise<Map<string, UptimeCount>>;

  /** One application's checks since a point in time, oldest first. */
  abstract findHealthChecks(appId: string, since: Date): Promise<HealthCheckRecord[]>;

  /** Drops history older than `before`; returns how many rows went. */
  abstract deleteHealthChecksBefore(before: Date): Promise<number>;

  /** For the BFF's own /health. */
  abstract ping(): Promise<boolean>;
}
