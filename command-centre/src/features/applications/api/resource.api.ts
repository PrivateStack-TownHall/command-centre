import createApiClient from "@/lib/axios";
import { unwrapItem, unwrapList, unwrapMeta } from "@/lib/api-response";

export interface ResourceParams {
  search?: string;
  page?: number;
  limit?: number;
  categoryId?: string;
  sort?: string;
  order?: string;
  [key: string]: unknown;
}

/**
 * Generic REST resource client. Every tab of every application (Products,
 * Categories, Posts, Comments, Departments, Warehouses, ...) is fetched
 * through this one implementation instead of a dedicated *.api.ts file
 * per resource — the only inputs that differ are the base URL and the
 * endpoint path, both of which come from application.config.ts.
 */
export const resourceApi = {
  async getAll<T = unknown>(
    baseUrl: string,
    endpoint: string,
    params?: ResourceParams,
  ) {
    const api = createApiClient(baseUrl);

    const response = await api.get(endpoint, { params });

    return {
      data: unwrapList<T>(response.data),
      meta: unwrapMeta(response.data),
    };
  },

  async getById<T = unknown>(
    baseUrl: string,
    endpoint: string,
    id: number | string,
  ) {
    const api = createApiClient(baseUrl);

    const response = await api.get(`${endpoint}/${id}`);

    return unwrapItem<T>(response.data);
  },
};
