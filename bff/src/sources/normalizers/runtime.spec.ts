import { normalizeMonitoring, summarizeActivities } from "./runtime";

describe("normalizeMonitoring", () => {
  it("reads a full /monitoring body", () => {
    const section = normalizeMonitoring({
      success: true,
      application: "Kings Brew",
      node: {
        version: "v22.14.0",
        uptime: 123,
        platform: "linux",
        environment: "production",
      },
      memory: { rss: 65536000, heapTotal: 34000000, heapUsed: 21000000 },
      database: { status: "CONNECTED", latency: 12 },
      response: { generatedAt: "2026-06-18T00:00:00.000Z" },
    });

    expect(section.node).toEqual({
      version: "v22.14.0",
      uptimeSeconds: 123,
      platform: "linux",
      environment: "production",
    });
    expect(section.database).toEqual({ status: "CONNECTED", latencyMs: 12 });
    expect(section.generatedAt).toBe("2026-06-18T00:00:00.000Z");
  });

  it("fills every field with null when the body is empty or odd", () => {
    const section = normalizeMonitoring("nope");

    expect(section.node.version).toBeNull();
    expect(section.memory.rss).toBeNull();
    expect(section.database).toEqual({ status: null, latencyMs: null });
  });
});

describe("summarizeActivities", () => {
  const body = {
    success: true,
    data: [
      {
        id: "order-12",
        type: "ORDER_CREATED",
        entity: "Order",
        title: "#12",
        description: "Order PENDING",
        createdAt: "2026-06-18T01:00:00Z",
      },
      {
        id: "product-5",
        type: "PRODUCT_CREATED",
        entity: "Product",
        title: "Espresso",
        description: "New product",
        createdAt: "2026-06-18T00:00:00Z",
      },
      {
        id: "review-3",
        type: "REVIEW_CREATED",
        entity: "Review",
        title: "5 stars",
        description: "New review",
        createdAt: "2026-06-19T00:00:00Z",
      },
    ],
  };

  it("keeps the newest entries and counts the rest", () => {
    const section = summarizeActivities(body, 2);

    expect(section.total).toBe(3);
    expect(section.latest.map((item) => item.id)).toEqual([
      "review-3",
      "order-12",
    ]);
  });

  it("accepts a plain array and tolerates missing fields", () => {
    const section = summarizeActivities([{ id: 7 }], 5);

    expect(section.latest[0]).toEqual({
      id: "7",
      type: null,
      entity: null,
      title: null,
      description: null,
      createdAt: null,
    });
  });
});
