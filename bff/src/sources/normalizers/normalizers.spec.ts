import {
  normalizeHealth,
  normalizeStats,
  summarizeOrders,
  summarizeReviews,
  unwrapList,
} from "./index";

describe("unwrapList", () => {
  it("accepts every envelope the backends use", () => {
    expect(unwrapList([{ id: 1 }])).toEqual([{ id: 1 }]);
    expect(unwrapList({ success: true, data: [{ id: 1 }] })).toEqual([{ id: 1 }]);
    expect(unwrapList({ data: { data: [{ id: 1 }] } })).toEqual([{ id: 1 }]);
    expect(unwrapList({ data: {} })).toEqual([]);
    expect(unwrapList(null)).toEqual([]);
  });
});

describe("normalizeHealth", () => {
  it("reads /health bodies", () => {
    expect(
      normalizeHealth({ status: "UP", database: "CONNECTED", version: "1.0.0", uptime: 123 }, 90),
    ).toEqual({
      status: "UP",
      reachable: true,
      latencyMs: 90,
      database: "CONNECTED",
      version: "1.0.0",
      uptimeSeconds: 123,
    });
  });

  it("treats GET / answering success:true as UP", () => {
    expect(normalizeHealth({ success: true, message: "Castle Kitchen API" }, 50).status).toBe("UP");
    expect(normalizeHealth({ status: "DOWN" }, 50).status).toBe("DOWN");
  });
});

describe("normalizeStats", () => {
  it("drops the success flag", () => {
    expect(normalizeStats({ success: true, products: { total: 42 } })).toEqual({
      products: { total: 42 },
    });
    expect(normalizeStats("nope")).toBeNull();
  });
});

describe("summarizeReviews", () => {
  const body = {
    data: [
      { id: 1, productId: 1, rating: 5, comment: "Great", createdAt: "2026-06-01T00:00:00Z", product: { name: "Espresso" }, user: { fullName: "Ana" } },
      { id: 2, productId: 2, rating: 3, comment: null, createdAt: "2026-06-03T00:00:00Z" },
      { id: 3, productId: 1, rating: 4, createdAt: "2026-06-02T00:00:00Z" },
    ],
  };

  it("keeps totals over every review and only the newest few items", () => {
    const summary = summarizeReviews(body, 2);

    expect(summary.total).toBe(3);
    expect(summary.averageRating).toBe(4);
    expect(summary.latest.map((review) => review.id)).toEqual([2, 3]);
  });

  it("tolerates missing relations and comments", () => {
    const [newest] = summarizeReviews(body, 1).latest;

    expect(newest).toMatchObject({ productName: null, customerName: null, comment: null });
  });
});

describe("summarizeOrders", () => {
  it("counts by status, sums string amounts and keeps the newest", () => {
    const summary = summarizeOrders(
      {
        data: [
          { id: 1, status: "PENDING", totalAmount: "25000", createdAt: "2026-06-01T00:00:00Z", items: [{}, {}] },
          { id: 2, status: "COMPLETED", totalAmount: 50000, createdAt: "2026-06-05T00:00:00Z", user: { fullName: "Budi" } },
          { id: 3, status: "PENDING", totalAmount: "10000", createdAt: "2026-06-03T00:00:00Z" },
        ],
      },
      2,
    );

    expect(summary.total).toBe(3);
    expect(summary.byStatus).toEqual({ PENDING: 2, COMPLETED: 1 });
    expect(summary.totalAmount).toBe(85000);
    expect(summary.latest.map((order) => order.id)).toEqual([2, 3]);
    expect(summary.latest[0]).toMatchObject({ customerName: "Budi", itemCount: 0 });
  });
});
