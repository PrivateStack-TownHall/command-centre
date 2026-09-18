import type { CommandCentreApplication } from "@/features/dashboard/types/command-centre.type";

import type { BffApplication, BffDashboard } from "../types/bff.type";

/*
 * The BFF stores summaries, while the dashboard components were written for
 * the backends' raw responses. Mapping here keeps every component unchanged.
 */

const EMPTY_STATS = {
  application: { name: "", type: "" },
  products: { total: 0, active: 0, inactive: 0 },
  categories: { total: 0 },
  images: { total: 0 },
  reviews: { total: 0, averageRating: 0 },
  orders: { total: 0, pending: 0, completed: 0, cancelled: 0 },
  payments: { total: 0, success: 0, failed: 0 },
  favorites: { total: 0 },
  latest: { product: "", review: "", order: "" },
};

export function toCommandCentreApplication(
  app: BffApplication,
): CommandCentreApplication {
  return {
    id: app.id,
    name: app.name,
    emoji: app.emoji,

    health: {
      status: app.health?.status ?? "DOWN",
      application: app.name,
      database: app.health?.database ?? "-",
      version: app.health?.version ?? "-",
      timestamp: app.fetchedAt ?? "",
      uptime: app.health?.uptimeSeconds ?? 0,
    },

    // Stats come straight from each backend's /stats, so the shape already
    // matches; the fallback keeps cards at 0 for apps without that endpoint.
    stats: { ...EMPTY_STATS, ...(app.stats ?? {}) } as CommandCentreApplication["stats"],

    monitoring: {
      application: app.name,
      node: {
        version: app.monitoring?.node.version ?? "-",
        uptime: app.monitoring?.node.uptimeSeconds ?? 0,
        platform: app.monitoring?.node.platform ?? "-",
        environment: app.monitoring?.node.environment ?? "-",
      },
      memory: {
        rss: app.monitoring?.memory.rss ?? 0,
        heapTotal: app.monitoring?.memory.heapTotal ?? 0,
        heapUsed: app.monitoring?.memory.heapUsed ?? 0,
        external: 0,
      },
      database: {
        status: app.monitoring?.database.status ?? "-",
        latency: app.monitoring?.database.latencyMs ?? 0,
      },
      response: { generatedAt: app.monitoring?.generatedAt ?? "" },
    },

    activities: (app.activities?.latest ?? []).map((activity) => ({
      id: activity.id ?? "",
      type: activity.type ?? "",
      entity: activity.entity ?? "",
      title: activity.title ?? "",
      description: activity.description ?? "",
      createdAt: activity.createdAt ?? "",
      application: app.name,
    })),

    reviews: (app.reviews?.latest ?? []).map((review) => ({
      ...review,
      user: { fullName: review.customerName ?? "Anonymous" },
      product: { name: review.productName ?? `Product #${review.productId}` },
    })),

    orders: (app.orders?.latest ?? []).map((order) => ({
      ...order,
      user: { fullName: order.customerName ?? "Anonymous" },
      items: Array.from({ length: order.itemCount }),
    })),

    // Kept for type compatibility; the dashboard doesn't display them.
    favorites: [],
    cart: [],
    payments: [],
    orderStatusHistory: [],
  };
}

export const toCommandCentreApplications = (dashboard: BffDashboard) =>
  dashboard.applications.map(toCommandCentreApplication);
