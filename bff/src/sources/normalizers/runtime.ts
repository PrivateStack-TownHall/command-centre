/*
 * Sections that only some backends expose: GET /monitoring (process and
 * database information) and GET /activities (a public feed of what happened
 * recently). Both are optional — a backend without them simply stores null.
 */

type Json = Record<string, unknown>;

const isObject = (value: unknown): value is Json =>
  !!value && typeof value === "object" && !Array.isArray(value);

const str = (value: unknown): string | null =>
  typeof value === "string" && value.length > 0 ? value : null;

const num = (value: unknown): number | null => {
  const parsed = typeof value === "string" ? Number(value) : value;
  return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : null;
};

export interface MonitoringSection {
  node: {
    version: string | null;
    uptimeSeconds: number | null;
    platform: string | null;
    environment: string | null;
  };
  memory: {
    rss: number | null;
    heapTotal: number | null;
    heapUsed: number | null;
  };
  database: {
    status: string | null;
    latencyMs: number | null;
  };
  generatedAt: string | null;
}

/** Reads GET /monitoring; every field is optional. */
export function normalizeMonitoring(body: unknown): MonitoringSection {
  const data = isObject(body) ? body : {};
  const node = isObject(data.node) ? data.node : {};
  const memory = isObject(data.memory) ? data.memory : {};
  const database = isObject(data.database) ? data.database : {};
  const response = isObject(data.response) ? data.response : {};

  return {
    node: {
      version: str(node.version),
      uptimeSeconds: num(node.uptime),
      platform: str(node.platform),
      environment: str(node.environment),
    },
    memory: {
      rss: num(memory.rss),
      heapTotal: num(memory.heapTotal),
      heapUsed: num(memory.heapUsed),
    },
    database: {
      status: str(database.status),
      latencyMs: num(database.latency),
    },
    generatedAt: str(response.generatedAt),
  };
}

export interface ActivityItem {
  id: string | null;
  type: string | null;
  entity: string | null;
  title: string | null;
  description: string | null;
  createdAt: string | null;
}

export interface ActivitiesSection {
  total: number;
  latest: ActivityItem[];
}

const byNewest = (a: Json, b: Json) =>
  (Date.parse(String(b.createdAt ?? "")) || 0) -
  (Date.parse(String(a.createdAt ?? "")) || 0);

/** Reads GET /activities and keeps only the newest few entries. */
export function summarizeActivities(body: unknown, limit: number): ActivitiesSection {
  const items = Array.isArray(body)
    ? body.filter(isObject)
    : isObject(body) && Array.isArray(body.data)
      ? body.data.filter(isObject)
      : [];

  return {
    total: items.length,
    latest: [...items]
      .sort(byNewest)
      .slice(0, limit)
      .map((item) => ({
        id: str(item.id) ?? (num(item.id) === null ? null : String(item.id)),
        type: str(item.type),
        entity: str(item.entity),
        title: str(item.title),
        description: str(item.description),
        createdAt: str(item.createdAt),
      })),
  };
}
