import { useQueries } from "@tanstack/react-query";

import { statsApi } from "@/features/applications/api/stats.api";
import { publicFeatureQueryKey } from "@/features/applications/hooks/usePublicFeatureData";
import { fetchApplicationOrders } from "@/features/orders/api/orders.api";
import { ORDER_APPLICATIONS } from "@/features/orders/config/order.config";
import { fetchApplicationReviews } from "@/features/reviews/api/reviews.api";
import { REVIEW_APPLICATIONS } from "@/features/reviews/config/review.config";
import {
  fetchHealth,
  fetchMonitoring,
  healthQueryKey,
  monitoringQueryKey,
} from "@/features/monitoring/api/health.api";

import {
  fetchDashboardList,
  healthFallback,
  monitoringFallback,
  statsFallback,
} from "../api/command-centre.api";
import { COMMAND_CENTRE_CONFIG } from "../config/command-centre.config";
import type { CommandCentreApplication } from "../types/command-centre.type";

type App = (typeof COMMAND_CENTRE_CONFIG)[number];

const LIST_PATHS = {
  activities: "/activities",
  favorites: "/public/favorites",
  cart: "/public/cart",
  payments: "/public/payments",
  orderStatusHistory: "/public/order-status-history",
} as const;

type ListName = keyof typeof LIST_PATHS;

const LIST_NAMES = Object.keys(LIST_PATHS) as ListName[];

/*
 * Query keys are shared with the pages that fetch the same data, so moving
 * between Dashboard, Monitoring, Applications, Reviews and Orders reuses
 * the cache instead of refetching:
 *   health / monitoring → Monitoring page
 *   stats               → application page stat cards
 *   reviews / orders    → Reviews and Orders pages
 */
function queriesFor(app: App) {
  const reviewsApp = REVIEW_APPLICATIONS.find(
    (item) => item.id === app.id && item.status === "available",
  );
  const ordersApp = ORDER_APPLICATIONS.find(
    (item) => item.id === app.id && item.status === "available",
  );

  return [
    {
      queryKey: healthQueryKey(app.id),
      queryFn: () => fetchHealth(app.baseUrl, "/health"),
    },
    {
      queryKey: ["stats", app.id, "/stats"],
      queryFn: () => statsApi.get(app.baseUrl, "/stats"),
    },
    {
      queryKey: monitoringQueryKey(app.id),
      queryFn: () => fetchMonitoring(app.baseUrl),
    },
    {
      queryKey: publicFeatureQueryKey("reviews", app.id),
      queryFn: () => (reviewsApp ? fetchApplicationReviews(reviewsApp) : []),
      enabled: !!reviewsApp,
    },
    {
      queryKey: publicFeatureQueryKey("orders", app.id),
      queryFn: () => (ordersApp ? fetchApplicationOrders(ordersApp) : []),
      enabled: !!ordersApp,
    },
    ...LIST_NAMES.map((name) => ({
      queryKey: ["dashboard", name, app.id],
      queryFn: () => fetchDashboardList(app.baseUrl, LIST_PATHS[name]),
    })),
  ];
}

const QUERIES_PER_APP = queriesFor(COMMAND_CENTRE_CONFIG[0]).length;

/**
 * Dashboard data, one query per endpoint. The page shows as soon as health
 * and stats have settled; the other sections fill in as they arrive.
 */
export function useCommandCentre() {
  return useQueries({
    queries: COMMAND_CENTRE_CONFIG.flatMap((app) =>
      queriesFor(app).map((query) => ({ enabled: !!app.baseUrl, ...query })),
    ),
    combine: (results) => {
      const apps = COMMAND_CENTRE_CONFIG.map((app, appIndex) => {
        const slice = results.slice(
          appIndex * QUERIES_PER_APP,
          (appIndex + 1) * QUERIES_PER_APP,
        );
        const [health, stats, monitoring, reviews, orders, ...lists] = slice;

        const listData = Object.fromEntries(
          LIST_NAMES.map((name, index) => [
            name,
            (lists[index]?.data as unknown[] | undefined) ?? [],
          ]),
        ) as Record<ListName, unknown[]>;

        const healthBody = (
          health?.data as { body?: CommandCentreApplication["health"] } | undefined
        )?.body;

        const application: CommandCentreApplication = {
          id: app.id,
          name: app.name,
          emoji: app.emoji,
          // Merged over the fallbacks so a response missing a section
          // (e.g. no `orders` block in /stats) can't crash a card.
          health: { ...healthFallback(app), ...healthBody },
          stats: {
            ...statsFallback(app),
            ...(stats?.data as Partial<CommandCentreApplication["stats"]> | undefined),
          },
          monitoring: {
            ...monitoringFallback(app),
            ...(monitoring?.data as
              | Partial<CommandCentreApplication["monitoring"]>
              | undefined),
          },
          reviews: (reviews?.data as unknown[] | undefined) ?? [],
          orders: (orders?.data as unknown[] | undefined) ?? [],
          ...listData,
        } as CommandCentreApplication;

        return application;
      });

      const core = results.filter((_, index) => index % QUERIES_PER_APP < 2);

      return {
        data: apps,
        isLoading: core.some((result) => result.isPending && result.fetchStatus !== "idle"),
        isError: core.length > 0 && core.every((result) => result.isError),
      };
    },
  });
}
