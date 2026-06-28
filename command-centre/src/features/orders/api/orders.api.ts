import createApiClient from "@/lib/axios";

import type { Order } from "../types/order.type";

const APPLICATION_CONFIG = {
  "kings-brew": {
    app: {
      id: "kings-brew",
      name: "Kings Brew",
      shortName: "KB",
      emoji: "☕",
      color: "#8B5E3C",
      description: "Coffee Ordering Platform",
      path: "/applications/kings-brew",
      url: "https://kings-brew.onrender.com",
    },
    emoji: "☕",
    color: "coffee",
    entityName: "Coffee",
    entityPluralName: "Coffees",

    endpoints: {
      entities: "/coffees",
      categories: "/coffee-categories",
      images: "/coffee-images",
      reviews: "/reviews",
      orders: "/orders",
    },
  },
};

export const ordersApi = {
  async getAll(appId: string): Promise<Order[]> {
    try {
      const config = APPLICATION_CONFIG["kings-brew"];

      const api = createApiClient(config.app.url);

      const response = await api.get("/public/orders");

      return response.data?.data ?? [];
    } catch (error) {
      console.error(`Failed to fetch orders from ${appId}`, error);

      return [];
    }
  },
};
