import createApiClient from "@/lib/axios";
import { unwrapList } from "@/lib/api-response";

import type { PublicFeatureApplication } from "@/features/applications/utils/public-endpoints";

import type { AppReview, Review } from "../types/review.type";

/** Reviews of one application, tagged with where they came from.
 *  Throws on failure so the query can retry a sleeping backend. */
export async function fetchApplicationReviews(
  app: PublicFeatureApplication,
): Promise<AppReview[]> {
  const api = createApiClient(app.baseUrl);

  const response = await api.get(app.endpoint as string);

  return unwrapList<Review>(response.data).map((review) => ({
    ...review,
    appId: app.id,
    appName: app.name,
    appEmoji: app.emoji,
  }));
}
