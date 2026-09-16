/**
 * Every backend in the ecosystem (commerce-core & operations-core) wraps
 * its responses the same way, via a shared NestJS ResponseInterceptor:
 *
 *   Success (single item):  { success: true, message?: string, data: T }
 *   Success (list):         { success: true, meta?: PaginationMeta, data: T[] }
 *   Error:                  { success: false, statusCode, error, message, ... }
 *
 * Previously each *.api.ts file unwrapped this by hand and did it
 * inconsistently (categories.api.ts returned the raw envelope while
 * images.api.ts/reviews.api.ts returned `response.data.data`) — that
 * mismatch is exactly what caused "categories.slice is not a function".
 *
 * Every API call should go through unwrapList/unwrapItem instead of
 * touching `response.data` directly, so the shape is handled in one
 * place and a malformed/unexpected response degrades to an empty
 * result instead of crashing the page.
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  meta?: PaginationMeta;
  data?: T;
}

/**
 * Safely extracts a list from an API response, regardless of whether the
 * caller already unwrapped it. Falls back to [] for anything unexpected
 * instead of throwing — a page should show "no data" rather than crash.
 */
export function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object" && "data" in payload) {
    const data = (payload as ApiEnvelope<T[]>).data;

    if (Array.isArray(data)) {
      return data;
    }
  }

  return [];
}

/** Extracts a single item from an envelope (or returns the value as-is). */
export function unwrapItem<T>(payload: unknown): T | undefined {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T | undefined;
}

/** Extracts pagination meta, if present. */
export function unwrapMeta(payload: unknown): PaginationMeta | undefined {
  if (payload && typeof payload === "object" && "meta" in payload) {
    return (payload as ApiEnvelope<unknown>).meta;
  }

  return undefined;
}
