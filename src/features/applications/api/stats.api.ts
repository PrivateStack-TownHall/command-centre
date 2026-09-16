import createApiClient from "@/lib/axios";

/**
 * GET /stats responses look like:
 *   { success: true, application: {...}, products: { total: 42 }, ... }
 * — the counts sit directly on the body, not under a `data` key like
 * every other endpoint. So this doesn't go through unwrapList/unwrapItem.
 */
export const statsApi = {
  async get(baseUrl: string): Promise<Record<string, any>> {
    const api = createApiClient(baseUrl);

    const response = await api.get("/stats");

    return response.data ?? {};
  },
};

/** Reads a dot-path like "products.total" out of a stats object. */
export function getStatValue(
  stats: Record<string, any> | undefined,
  path: string,
): number | undefined {
  if (!stats) return undefined;

  const value = path
    .split(".")
    .reduce<any>((acc, key) => (acc == null ? undefined : acc[key]), stats);

  return typeof value === "number" ? value : undefined;
}
