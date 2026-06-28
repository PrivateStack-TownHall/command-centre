import createApiClient from "@/lib/axios";

import { APPLICATION_CONFIG } from "../config/application.config";

export const reviewsApi = {
  async getAll(appId: string) {
    const config = APPLICATION_CONFIG[appId as keyof typeof APPLICATION_CONFIG];

    const api = createApiClient(config.app.url);

    const response = await api.get(config.endpoints.reviews);

    return response.data.data;
  },

  async getById(appId: string, id: number | string) {
    const config = APPLICATION_CONFIG[appId as keyof typeof APPLICATION_CONFIG];

    const api = createApiClient(config.app.url);

    const response = await api.get(`${config.endpoints.reviews}/${id}`);

    return response.data.data;
  },
};
