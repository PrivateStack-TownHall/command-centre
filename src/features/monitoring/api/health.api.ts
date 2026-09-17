import createApiClient from "@/lib/axios";

export interface HealthCheck {
  status: "UP" | "DOWN";
  /** Round trip measured in the browser (includes any cold start). */
  latencyMs: number;
  /** Raw body of the health response, for pages that show its details. */
  body: Record<string, unknown>;
}

export const healthQueryKey = (appId: string) => ["health", appId] as const;

export const monitoringQueryKey = (appId: string) =>
  ["monitoring", appId] as const;

/**
 * Pings an application's health endpoint. `/health` answers
 * `{ status: "UP" }`; the commerce apps without it are checked with
 * `GET /`, which answers `{ success: true }`.
 */
export async function fetchHealth(
  baseUrl: string,
  endpoint: string,
): Promise<HealthCheck> {
  const api = createApiClient(baseUrl);
  const startedAt = performance.now();

  const response = await api.get(endpoint);

  const body =
    response.data && typeof response.data === "object"
      ? (response.data as Record<string, unknown>)
      : {};

  const isUp =
    typeof body.status === "string" ? body.status === "UP" : body.success === true;

  return {
    status: isUp ? "UP" : "DOWN",
    latencyMs: Math.round(performance.now() - startedAt),
    body,
  };
}

/** Raw GET /monitoring body (Kings Brew only for now). */
export async function fetchMonitoring(baseUrl: string) {
  const api = createApiClient(baseUrl);

  const response = await api.get("/monitoring");

  return response.data as Record<string, unknown>;
}
