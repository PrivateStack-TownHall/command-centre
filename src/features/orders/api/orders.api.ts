import createApiClient from "@/lib/axios";
import { unwrapList } from "@/lib/api-response";

import { APPLICATION_CONFIG } from "@/features/applications/config/application.config";
import type { ApplicationId } from "@/features/applications/config/application.config";

import type { Order } from "../types/order.type";

export const ordersApi = {
  async getAll(appId: string): Promise<Order[]> {
    const config = APPLICATION_CONFIG[appId as ApplicationId];

    if (!config?.app.url) {
      return [];
    }

    try {
      const api = createApiClient(config.app.url);

      const response = await api.get("/public/orders");

      return unwrapList<Order>(response.data);
    } catch (error) {
      console.error(`Failed to fetch orders from ${appId}`, error);

      return [];
    }
  },
};
