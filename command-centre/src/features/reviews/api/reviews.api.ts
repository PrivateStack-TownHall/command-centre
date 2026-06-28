import createApiClient from "@/lib/axios";

import { REVIEW_APPLICATIONS } from "../config/review.config";

export const reviewsApi = {
  async getAll() {
    const results = await Promise.allSettled(
      REVIEW_APPLICATIONS.map(async (appId) => {
        try {
          const { APPLICATION_CONFIG } =
            await import("@/features/applications/config/application.config");

          const config = APPLICATION_CONFIG[appId];

          const api = createApiClient(config.app.url);

          const response = await api.get(config.endpoints.reviews);

          const reviews = response.data?.data ?? [];

          return reviews.map((review: any) => ({
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
