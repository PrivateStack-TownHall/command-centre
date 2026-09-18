export * from "./runtime";
/*
 * Turn each backend's raw responses into the small, uniform pieces stored in
 * a snapshot. Every function is defensive: backends differ slightly, and a
 * missing field must never throw.
 */

type Json = Record<string, unknown>;

const isObject = (value: unknown): value is Json =>
  !!value && typeof value === "object" && !Array.isArray(value);

const str = (value: unknown): string | null =>
  typeof value === "string" && value.length > 0 ? value : null;

const num = (value: unknown): number | null => {
  const parsed = typeof value === "string" ? Number(value) : value;
  return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : null;
};

/** Accepts `[...]`, `{ data: [...] }` and `{ data: { data: [...] } }`. */
export function unwrapList(body: unknown): Json[] {
  if (Array.isArray(body)) return body.filter(isObject);
  if (isObject(body)) {
    if (Array.isArray(body.data)) return body.data.filter(isObject);
    if (isObject(body.data) && Array.isArray(body.data.data)) {
      return body.data.data.filter(isObject);
    }
  }
  return [];
}

export interface HealthSection {
  status: "UP" | "DOWN";
  reachable: boolean;
  latencyMs: number | null;
  database: string | null;
  version: string | null;
  uptimeSeconds: number | null;
}

/** `/health` answers `{ status: "UP" }`; `GET /` answers `{ success: true }`. */
export function normalizeHealth(
  body: unknown,
  latencyMs: number,
): HealthSection {
  const data = isObject(body) ? body : {};
  const isUp =
    typeof data.status === "string"
      ? data.status === "UP"
      : data.success === true;

  return {
    status: isUp ? "UP" : "DOWN",
    reachable: true,
    latencyMs,
    database: str(data.database),
    version: str(data.version),
    uptimeSeconds: num(data.uptime),
  };
}

export const unreachableHealth = (): HealthSection => ({
  status: "DOWN",
  reachable: false,
  latencyMs: null,
  database: null,
  version: null,
  uptimeSeconds: null,
});

/** `/stats` counts, without the envelope's `success` flag. */
export function normalizeStats(body: unknown): Json | null {
  if (!isObject(body)) return null;

  const { success: _success, ...stats } = body;

  return stats;
}

const byNewest = (a: Json, b: Json) =>
  (Date.parse(String(b.createdAt ?? "")) || 0) -
  (Date.parse(String(a.createdAt ?? "")) || 0);

export interface ReviewSummaryItem {
  id: number | string | null;
  productId: number | string | null;
  productName: string | null;
  rating: number | null;
  comment: string | null;
  customerName: string | null;
  createdAt: string | null;
}

export interface ReviewsSection {
  total: number;
  /** Mean over every review, not per product. */
  averageRating: number | null;
  latest: ReviewSummaryItem[];
}

export function summarizeReviews(body: unknown, limit: number): ReviewsSection {
  const reviews = unwrapList(body);
  const ratings = reviews
    .map((review) => num(review.rating))
    .filter((r): r is number => r !== null);

  return {
    total: reviews.length,
    averageRating: ratings.length
      ? Math.round(
          (ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 100,
        ) / 100
      : null,
    latest: [...reviews]
      .sort(byNewest)
      .slice(0, limit)
      .map((review) => {
        const product = isObject(review.product) ? review.product : {};
        const user = isObject(review.user) ? review.user : {};

        return {
          id: (review.id as number | string | undefined) ?? null,
          productId: (review.productId as number | string | undefined) ?? null,
          productName: str(product.name),
          rating: num(review.rating),
          comment: str(review.comment),
          customerName: str(user.fullName),
          createdAt: str(review.createdAt),
        };
      }),
  };
}

export interface OrderSummaryItem {
  id: number | string | null;
  orderNumber: string | null;
  status: string | null;
  totalAmount: number | null;
  customerName: string | null;
  itemCount: number;
  createdAt: string | null;
}

export interface OrdersSection {
  total: number;
  byStatus: Record<string, number>;
  totalAmount: number;
  latest: OrderSummaryItem[];
}

export function summarizeOrders(body: unknown, limit: number): OrdersSection {
  const orders = unwrapList(body);
  const byStatus: Record<string, number> = {};
  let totalAmount = 0;

  for (const order of orders) {
    const status = str(order.status) ?? "UNKNOWN";
    byStatus[status] = (byStatus[status] ?? 0) + 1;
    totalAmount += num(order.totalAmount) ?? 0;
  }

  return {
    total: orders.length,
    byStatus,
    totalAmount,
    latest: [...orders]
      .sort(byNewest)
      .slice(0, limit)
      .map((order) => {
        const user = isObject(order.user) ? order.user : {};

        return {
          id: (order.id as number | string | undefined) ?? null,
          orderNumber: str(order.orderNumber),
          status: str(order.status),
          totalAmount: num(order.totalAmount),
          customerName: str(user.fullName),
          itemCount: Array.isArray(order.items) ? order.items.length : 0,
          createdAt: str(order.createdAt),
        };
      }),
  };
}
