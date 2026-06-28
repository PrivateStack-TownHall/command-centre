import createApiClient from "@/lib/axios";

import { APPLICATION_CONFIG } from "../config/application.config";

export interface EntityParams {
  search?: string;
  page?: number;
  limit?: number;
  categoryId?: string;
  sort?: string;
  order?: string;
}

export const entitiesApi = {
  async getAll(appId: string, params?: EntityParams) {
    const config = APPLICATION_CONFIG[appId as keyof typeof APPLICATION_CONFIG];
    console.log("CONFIG", config);

    const api = createApiClient(config.app.url);

    console.log("BASE URL", config.app.url);

    console.log("ENDPOINT", config.endpoints.entities);
    const response = await api.get(config.endpoints.entities, {
      params,
    });
    console.log("RESPONSE", response.data);

    return response.data;
  },

  async getById(appId: string, id: number) {
    const config = APPLICATION_CONFIG[appId as keyof typeof APPLICATION_CONFIG];

    const api = createApiClient(config.app.url);

    const response = await api.get(`${config.endpoints.entities}/${id}`);

    return response.data;
  },
};
