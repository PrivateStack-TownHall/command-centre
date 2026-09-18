import type {
  ActivitiesSection,
  HealthSection,
  MonitoringSection,
  OrdersSection,
  ReviewsSection,
} from "../sources/normalizers";

/** What the BFF keeps per application — summaries, never whole tables. */
export interface AppSnapshotData {
  health: HealthSection | null;
  stats: Record<string, unknown> | null;
  /** GET /monitoring: process, memory and database information. */
  monitoring: MonitoringSection | null;
  /** GET /activities: what happened recently in that application. */
  activities: ActivitiesSection | null;
  reviews: ReviewsSection | null;
  orders: OrdersSection | null;
}

export type SnapshotSection = keyof AppSnapshotData;

/** Why a section couldn't be refreshed last time, e.g. `{ stats: "HTTP 503" }`. */
export type SectionErrors = Partial<Record<SnapshotSection, string>>;

export const emptySnapshotData = (): AppSnapshotData => ({
  health: null,
  stats: null,
  monitoring: null,
  activities: null,
  reviews: null,
  orders: null,
});

export interface SnapshotRecord {
  appId: string;
  data: AppSnapshotData;
  errors: SectionErrors;
  /** When the last refresh finished (even if some sections failed). */
  fetchedAt: Date | null;
  /** Set while a refresh is running — acts as a lock. */
  refreshStartedAt: Date | null;
}

/**
 * "fresh"        younger than SNAPSHOT_TTL_SECONDS
 * "stale"        older — served as-is while a refresh runs in the background
 * "missing"      never fetched yet — a first refresh is running
 * "not-deployed" the app has no backend URL configured
 */
export type SnapshotFreshness = "fresh" | "stale" | "missing" | "not-deployed";

/** One stored health check, used for uptime and latency history. */
export interface HealthCheckRecord {
  status: "UP" | "DOWN";
  reachable: boolean;
  latencyMs: number | null;
  checkedAt: Date;
}

/** How many checks an application passed over a period. */
export interface UptimeCount {
  total: number;
  up: number;
}
