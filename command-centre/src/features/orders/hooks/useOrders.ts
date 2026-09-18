import { usePublicFeatureData } from "@/features/applications/hooks/usePublicFeatureData";

import { fetchApplicationOrders } from "../api/orders.api";
import { ORDER_APPLICATIONS } from "../config/order.config";

/** Public orders from every application with a live orders endpoint. */
export function useOrders() {
  return usePublicFeatureData("orders", ORDER_APPLICATIONS, fetchApplicationOrders);
}
