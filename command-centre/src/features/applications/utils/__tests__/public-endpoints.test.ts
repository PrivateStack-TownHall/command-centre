import { listPublicFeatureApplications } from "../public-endpoints";
import type { ApplicationConfig } from "../../config/application.config";

const app = (
  id: string,
  url: string,
  publicEndpoints?: ApplicationConfig["publicEndpoints"],
): ApplicationConfig =>
  ({
    app: { id, name: id.toUpperCase(), color: "#000000", url },
    emoji: "🧪",
    publicEndpoints,
    resources: [],
  }) as unknown as ApplicationConfig;

const configs = {
  live: app("live", "https://live.test", { reviews: "/reviews", orders: "/public/orders" }),
  planned: app("planned", "https://planned.test", { reviews: "/reviews", orders: null }),
  undeployed: app("undeployed", "", { reviews: "/reviews" }),
  unrelated: app("unrelated", "https://unrelated.test"),
};

describe("listPublicFeatureApplications", () => {
  it("marks apps with a path and a URL as available", () => {
    const [live] = listPublicFeatureApplications(configs, "orders");

    expect(live).toMatchObject({
      id: "live",
      endpoint: "/public/orders",
      baseUrl: "https://live.test",
      status: "available",
    });
  });

  it("marks null endpoints as coming soon", () => {
    const orders = listPublicFeatureApplications(configs, "orders");

    expect(orders.map((a) => [a.id, a.status])).toEqual([
      ["live", "available"],
      ["planned", "coming-soon"],
    ]);
    expect(orders[1].endpoint).toBeNull();
  });

  it("marks apps without a backend URL as coming soon", () => {
    const reviews = listPublicFeatureApplications(configs, "reviews");

    expect(reviews.find((a) => a.id === "undeployed")?.status).toBe("coming-soon");
  });

  it("leaves out apps where the feature is not applicable", () => {
    const ids = listPublicFeatureApplications(configs, "reviews").map((a) => a.id);

    expect(ids).toEqual(["live", "planned", "undeployed"]);
    expect(ids).not.toContain("unrelated");
  });
});
