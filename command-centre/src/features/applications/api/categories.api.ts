import createApiClient from "@/lib/axios";

import { APPLICATION_CONFIG } from "../config/application.config";

export const categoriesApi = {
  async getAll(appId: string) {
    const config = APPLICATION_CONFIG[appId as keyof typeof APPLICATION_CONFIG];

    const api = createApiClient(config.app.url);

    const response = await api.get(config.endpoints.categories);

    return response.data;
  },

  async getById(appId: string, id: number | string) {
    const config = APPLICATION_CONFIG[appId as keyof typeof APPLICATION_CONFIG];

    const api = createApiClient(config.app.url);

    const response = await api.get(`${config.endpoints.categories}/${id}`);

    return response.data;
  },
};
