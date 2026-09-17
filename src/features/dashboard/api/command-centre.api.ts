import createApiClient from "@/lib/axios";
import { unwrapList } from "@/lib/api-response";

import type { CommandCentreApplication } from "../types/command-centre.type";

type AppRef = { name: string };

/*
 * Fallbacks used while a request is still pending or after it failed, so
 * the dashboard cards can render the moment health and stats arrive.
 */

export const healthFallback = (app: AppRef): CommandCentreApplication["health"] => ({
    status: "DOWN",
    application: app.name,
    database: "DISCONNECTED",
    version: "-",
    timestamp: new Date().toISOString(),
    uptime: 0,
  });

export const statsFallback = (app: AppRef): CommandCentreApplication["stats"] => ({
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
  });

export const monitoringFallback = (app: AppRef): CommandCentreApplication["monitoring"] => ({
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
  });

/** Raw body of one dashboard endpoint (e.g. /activities). */
export async function fetchDashboardBody(baseUrl: string, path: string) {
  const api = createApiClient(baseUrl);

  const response = await api.get(path);

  return response.data;
}

/** List endpoints such as /public/favorites. */
export async function fetchDashboardList(baseUrl: string, path: string) {
  const api = createApiClient(baseUrl);

  const response = await api.get(path);

  return unwrapList<unknown>(response.data);
}
