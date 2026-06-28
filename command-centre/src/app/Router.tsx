import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";

import CommandCentrePage from "@/features/dashboard/pages/CommandCentrePage";

import ApplicationsPage from "@/features/applications/pages/KingsBrewPage";

import KingsBrewPage from "@/features/applications/pages/KingsBrewPage";
import CastleKitchenPage from "@/features/applications/pages/CastleKitchenPage";
import TradeHubPage from "@/features/applications/pages/TradeHubPage";
import ByteBurgerPage from "@/features/applications/pages/ByteBurgerPage";
import QuantumMartPage from "@/features/applications/pages/QuantumMartPage";
import PineappleStackPage from "@/features/applications/pages/PineappleStackPage";
import MployeePage from "@/features/applications/pages/MPloyeePage";
import CodigramPage from "@/features/applications/pages/CodigramPage";
import MedievalAirbnbPage from "@/features/applications/pages/MedievalAirBnBPage";
import LeatherShelfPage from "@/features/applications/pages/LeatherShelfPage";

import ReviewPage from "@/features/reviews/pages/ReviewPage";
import OrdersPage from "@/features/orders/pages/OrdersPage";
import MonitoringPage from "@/features/monitoring/pages/MonitoringPage";

import { APPLICATION_PATHS, PATHS } from "@/app/routes/paths";

const router = createBrowserRouter([
  {
    element: <AppLayout />,

    children: [
      {
        path: PATHS.COMMANDCENTRE,
        element: <CommandCentrePage />,
      },

      {
        path: PATHS.APPLICATIONS,
        element: <ApplicationsPage />,
      },

      {
        path: `${PATHS.APPLICATIONS}/${APPLICATION_PATHS.KINGS_BREW}`,
        element: <KingsBrewPage />,
      },

      {
        path: `${PATHS.APPLICATIONS}/${APPLICATION_PATHS.CASTLE_KITCHEN}`,
        element: <CastleKitchenPage />,
      },

      {
        path: `${PATHS.APPLICATIONS}/${APPLICATION_PATHS.TRADE_HUB}`,
        element: <TradeHubPage />,
      },

      {
        path: `${PATHS.APPLICATIONS}/${APPLICATION_PATHS.BYTE_BURGER}`,
        element: <ByteBurgerPage />,
      },

      {
        path: `${PATHS.APPLICATIONS}/${APPLICATION_PATHS.QUANTUM_MART}`,
        element: <QuantumMartPage />,
      },

      {
        path: `${PATHS.APPLICATIONS}/${APPLICATION_PATHS.PINEAPPLE_STACK}`,
        element: <PineappleStackPage />,
      },

      {
        path: `${PATHS.APPLICATIONS}/${APPLICATION_PATHS.M_PLOYEE}`,
        element: <MployeePage />,
      },

      {
        path: `${PATHS.APPLICATIONS}/${APPLICATION_PATHS.CODIGRAM}`,
        element: <CodigramPage />,
      },

      {
        path: `${PATHS.APPLICATIONS}/${APPLICATION_PATHS.MEDIEVAL_AIRBNB}`,
        element: <MedievalAirbnbPage />,
      },

      {
        path: `${PATHS.APPLICATIONS}/${APPLICATION_PATHS.LEATHER_SHELF}`,
        element: <LeatherShelfPage />,
      },

      {
        path: PATHS.REVIEWS,
        element: <ReviewPage />,
      },

      {
        path: PATHS.ORDERS,
        element: <OrdersPage />,
      },

      {
        path: PATHS.MONITORING,
        element: <MonitoringPage />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
