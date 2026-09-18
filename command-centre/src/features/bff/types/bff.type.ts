/*
 * Shape of the Command Centre BFF responses. The BFF answers from stored
 * snapshots, so every application carries how fresh its data is.
 */

export type SnapshotFreshness = "fresh" | "stale" | "missing" | "not-deployed";

export interface BffHealth {
  status: "UP" | "DOWN";
  reachable: boolean;
  latencyMs: number | null;
  database: string | null;
  version: string | null;
  uptimeSeconds: number | null;
}

export interface BffMonitoringSection {
  node: {
    version: string | null;
    uptimeSeconds: number | null;
    platform: string | null;
    environment: string | null;
  };
  memory: { rss: number | null; heapTotal: number | null; heapUsed: number | null };
  database: { status: string | null; latencyMs: number | null };
  generatedAt: string | null;
}

export interface BffActivity {
  id: string | null;
  type: string | null;
  entity: string | null;
  title: string | null;
  description: string | null;
  createdAt: string | null;
}

export interface BffReview {
  id: number | string | null;
  productId: number | string | null;
  productName: string | null;
  rating: number | null;
  comment: string | null;
  customerName: string | null;
  createdAt: string | null;
}

export interface BffOrder {
  id: number | string | null;
  orderNumber: string | null;
  status: string | null;
  totalAmount: number | null;
  customerName: string | null;
  itemCount: number;
  createdAt: string | null;
}

/** Sections are null when that application has no such endpoint. */
export interface BffApplication {
  id: string;
  name: string;
  emoji: string;
  group: string;
  deployed: boolean;
  freshness: SnapshotFreshness;
  refreshing: boolean;
  fetchedAt: string | null;
  ageSeconds: number | null;
  errors: Record<string, string>;
  health: BffHealth | null;
  stats: Record<string, any> | null;
  monitoring: BffMonitoringSection | null;
  activities: { total: number; latest: BffActivity[] } | null;
  reviews: { total: number; averageRating: number | null; latest: BffReview[] } | null;
  orders: {
    total: number;
    byStatus: Record<string, number>;
    totalAmount: number;
    latest: BffOrder[];
  } | null;
}

export type WithApp<T> = T & { appId: string; appName: string; appEmoji: string };

export interface BffDashboard {
  generatedAt: string;
  summary: {
    applications: number;
    deployed: number;
    online: number;
    offline: number;
    refreshing: number;
    reviews: { total: number; averageRating: number | null };
    orders: { total: number; byStatus: Record<string, number> };
  };
  latestReviews: WithApp<BffReview>[];
  latestOrders: WithApp<BffOrder>[];
  latestActivities: WithApp<BffActivity>[];
  applications: BffApplication[];
}

export type BffMonitoringState = "online" | "offline" | "unknown" | "not-deployed";

export interface BffMonitoringApplication {
  id: string;
  name: string;
  emoji: string;
  group: string;
  state: BffMonitoringState;
  health: BffHealth | null;
  uptimePercent: number | null;
  checksCounted: number;
  freshness: SnapshotFreshness;
  refreshing: boolean;
  fetchedAt: string | null;
  ageSeconds: number | null;
  error: string | null;
}

export interface BffMonitoring {
  generatedAt: string;
  uptimeWindowHours: number;
  summary: {
    total: number;
    online: number;
    offline: number;
    unknown: number;
    notDeployed: number;
  };
  applications: BffMonitoringApplication[];
}
