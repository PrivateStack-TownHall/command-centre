import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import RouteErrorBoundary from "@/components/shared/RouteErrorBoundary";

import { PATHS } from "@/app/routes/paths";

const CommandCentrePage = lazy(
  () => import("@/features/dashboard/pages/CommandCentrePage"),
);

const ApplicationsListPage = lazy(
  () => import("@/features/applications/pages/ApplicationsListPage"),
);
const ApplicationPage = lazy(
  () => import("@/features/applications/pages/ApplicationPage"),
);

const ReviewPage = lazy(() => import("@/features/reviews/pages/ReviewPage"));
const OrdersPage = lazy(() => import("@/features/orders/pages/OrdersPage"));
const MonitoringPage = lazy(
  () => import("@/features/monitoring/pages/MonitoringPage"),
);

const EcosystemMapPage = lazy(
  () => import("@/features/ecosystem-map/pages/EcosystemMapPage"),
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,

    children: [
      {
        path: PATHS.COMMANDCENTRE,
        element: <CommandCentrePage />,
        errorElement: <RouteErrorBoundary />,
      },

      {
        path: PATHS.APPLICATIONS,
        element: <ApplicationsListPage />,
        errorElement: <RouteErrorBoundary />,
      },

      {
        // Single dynamic route for every application, instead of one
        // hardcoded route + duplicated page component per app.
        path: `${PATHS.APPLICATIONS}/:appId`,
        element: <ApplicationPage />,
        errorElement: <RouteErrorBoundary />,
      },

      {
        path: PATHS.REVIEWS,
        element: <ReviewPage />,
        errorElement: <RouteErrorBoundary />,
      },

      {
        path: PATHS.ORDERS,
        element: <OrdersPage />,
        errorElement: <RouteErrorBoundary />,
      },

      {
        path: PATHS.MONITORING,
        element: <MonitoringPage />,
        errorElement: <RouteErrorBoundary />,
      },

      {
        path: PATHS.ECOSYSTEM_MAP,
        element: <EcosystemMapPage />,
        errorElement: <RouteErrorBoundary />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
