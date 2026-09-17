import createApiClient from "@/lib/axios";
import { unwrapList } from "@/lib/api-response";

import type { PublicFeatureApplication } from "@/features/applications/utils/public-endpoints";

import type { AppOrder, Order } from "../types/order.type";

/** Public orders of one application, tagged with where they came from.
 *  Throws on failure so the query can retry a sleeping backend. */
export async function fetchApplicationOrders(
  app: PublicFeatureApplication,
): Promise<AppOrder[]> {
  const api = createApiClient(app.baseUrl);

  const response = await api.get(app.endpoint as string);

  return unwrapList<Order>(response.data).map((order) => ({
    ...order,
    appId: app.id,
    appName: app.name,
    appEmoji: app.emoji,
  }));
}
