import createApiClient from "@/lib/axios";

import { COMMAND_CENTRE_CONFIG } from "../config/command-centre.config";

export const commandCentreApi = {
  async getDashboard() {
    const results = await Promise.allSettled(
      COMMAND_CENTRE_CONFIG.map(async (app) => {
        const api = createApiClient(app.baseUrl);

        const [
          health,
          stats,
          monitoring,
          activities,
          orders,
          reviews,
          favorites,
          cart,
          payments,
          orderStatusHistory,
        ] = await Promise.allSettled([
          api.get("/health"),
          api.get("/stats"),
          api.get("/monitoring"),
          api.get("/activities"),
          api.get("/public/orders"),
          api.get("/reviews"),
          api.get("/public/favorites"),
          api.get("/public/cart"),
          api.get("/public/payments"),
          api.get("/public/order-status-history"),
        ]);

        return {
          id: app.id,
          name: app.name,
          emoji: app.emoji,

          health:
            health.status === "fulfilled"
              ? health.value.data
              : {
                  status: "DOWN",
                  application: app.name,
                  database: "DISCONNECTED",
                  version: "-",
                  timestamp: new Date().toISOString(),
                  uptime: 0,
                },

          stats:
            stats.status === "fulfilled"
              ? stats.value.data
              : {
                  application: {
                    name: app.name,
                    type: "-",
                  },

                  products: {
                    total: 0,
                    active: 0,
                    inactive: 0,
                  },

                  categories: {
                    total: 0,
                  },

                  images: {
                    total: 0,
                  },

                  reviews: {
                    total: 0,
                    averageRating: 0,
                  },

                  orders: {
                    total: 0,
                    pending: 0,
                    completed: 0,
                    cancelled: 0,
                  },

                  payments: {
                    total: 0,
                    success: 0,
                    failed: 0,
                  },

                  favorites: {
                    total: 0,
                  },

                  latest: {
                    product: "",
                    review: "",
                    order: "",
                  },
                },

          monitoring:
            monitoring.status === "fulfilled"
              ? monitoring.value.data
              : {
                  application: app.name,

                  node: {
                    version: "-",
                    uptime: 0,
                    platform: "-",
                    environment: "-",
                  },

                  memory: {
                    rss: 0,
                    heapTotal: 0,
                    heapUsed: 0,
                    external: 0,
                  },

                  database: {
                    status: "DISCONNECTED",
                    latency: 0,
                  },

                  response: {
                    generatedAt: new Date().toISOString(),
                  },
                },

          activities:
            activities.status === "fulfilled" ? activities.value.data : [],

          orders:
            orders.status === "fulfilled" ? (orders.value.data.data ?? []) : [],

          reviews:
            reviews.status === "fulfilled"
              ? (reviews.value.data.data ?? [])
              : [],

          favorites:
            favorites.status === "fulfilled"
              ? (favorites.value.data.data ?? [])
              : [],

          cart: cart.status === "fulfilled" ? (cart.value.data.data ?? []) : [],

          payments:
            payments.status === "fulfilled"
              ? (payments.value.data.data ?? [])
              : [],

          orderStatusHistory:
            orderStatusHistory.status === "fulfilled"
              ? (orderStatusHistory.value.data.data ?? [])
              : [],
        };
      }),
    );

    return results
      .filter(
        (result): result is PromiseFulfilledResult<any> =>
          result.status === "fulfilled",
      )
      .map((result) => result.value);
  },
};
