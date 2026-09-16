import createApiClient from "@/lib/axios";
import { unwrapList } from "@/lib/api-response";

import { REVIEW_APPLICATIONS } from "../config/review.config";

export const reviewsApi = {
  async getAll() {
    const results = await Promise.allSettled(
      REVIEW_APPLICATIONS.map(async (appId) => {
        try {
          const { APPLICATION_CONFIG } =
            await import("@/features/applications/config/application.config");

          const config = APPLICATION_CONFIG[appId];

          const reviewsResource = config.resources.find(
            (r) => r.key === "reviews",
          );

          if (!config.app.url || !reviewsResource) {
            return [];
          }

          const api = createApiClient(config.app.url);

          const response = await api.get(reviewsResource.endpoint);

          const reviews = unwrapList<Record<string, unknown>>(response.data);

          return reviews.map((review) => ({
            ...review,
            appId,
            appName: config.app.name,
            appEmoji: config.emoji,
          }));
        } catch (error) {
          console.error(`Failed to fetch reviews from ${appId}`, error);

          return [];
        }
      }),
    );

    return results.flatMap((result) =>
      result.status === "fulfilled" ? result.value : [],
    );
  },
};
