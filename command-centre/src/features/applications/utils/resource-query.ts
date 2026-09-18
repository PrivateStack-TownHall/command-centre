import type { ResourceParams } from "../api/resource.api";
import type { ResourceConfig } from "../config/application.config";

export interface ResourceFilterState {
  search: string;
  categoryId: string;
  sort: string;
  order: string;
  page: number;
  limit: number;
}

/**
 * Builds the query string for one resource from the page's filter state,
 * sending only what that endpoint declares in `params` / `paginated`.
 * Empty values are dropped so the backend never receives `?categoryId=`.
 * Returns undefined when there is nothing to send.
 */
export function buildResourceParams(
  resource: Pick<ResourceConfig, "paginated" | "params"> | undefined,
  state: ResourceFilterState,
): ResourceParams | undefined {
  if (!resource) return undefined;

  const params: ResourceParams = {};
  const search = state.search.trim();

  if (resource.params?.search && search) {
    params.search = search;
  }

  if (resource.params?.category && state.categoryId) {
    params[resource.params.category.param] = state.categoryId;
  }

  if (resource.params?.sort) {
    if (state.sort) params.sort = state.sort;
    if (state.order) params.order = state.order;
  }

  if (resource.paginated) {
    params.page = state.page;
    params.limit = state.limit;
  }

  return Object.keys(params).length > 0 ? params : undefined;
}

/**
 * Browser-side search for resources whose endpoint has no `?search=`.
 * Matches the keyword against every top-level string/number field.
 */
export function filterRowsBySearch<T>(rows: T[], search: string): T[] {
  const keyword = search.trim().toLowerCase();

  if (!keyword) return rows;

  return rows.filter((row) => {
    if (!row || typeof row !== "object") return false;

    return Object.values(row as Record<string, unknown>).some(
      (value) =>
        (typeof value === "string" || typeof value === "number") &&
        String(value).toLowerCase().includes(keyword),
    );
  });
}
