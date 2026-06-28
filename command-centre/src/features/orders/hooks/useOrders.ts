import { useQuery } from "@tanstack/react-query";

import { ordersApi } from "../api/orders.api";

export function useOrders(appId: string) {
  return useQuery({
    queryKey: ["orders", appId],

    queryFn: () => ordersApi.getAll(appId),

    enabled: !!appId,

    staleTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,
  });
}
