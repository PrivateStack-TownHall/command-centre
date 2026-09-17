import createApiClient from "@/lib/axios";

export type StatsResponse = Record<string, unknown>;

/**
 * Stats responses look like:
 *   { success: true, application: {...}, products: { total: 42 }, ... }
 * — the counts sit directly on the body, not under a `data` key like
 * every other endpoint. So this doesn't go through unwrapList/unwrapItem.
 */
export const statsApi = {
  /**
   * @param endpoint The app's stats path from `statsEndpoint` in
   *   application.config.ts (usually "/stats").
   */
  async get(baseUrl: string, endpoint: string): Promise<StatsResponse> {
    const api = createApiClient(baseUrl);

    const response = await api.get(endpoint);

    const body: unknown = response.data;

    return body && typeof body === "object" ? (body as StatsResponse) : {};
  },
};

/** Reads a dot-path like "products.total" out of a stats object. */
export function getStatValue(
  stats: StatsResponse | undefined,
  path: string,
): number | undefined {
  if (!stats) return undefined;

  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, stats);

  return typeof value === "number" ? value : undefined;
}
