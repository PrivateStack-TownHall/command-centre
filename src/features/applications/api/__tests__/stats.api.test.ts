import { getStatValue } from "../stats.api";

describe("getStatValue", () => {
  const stats = {
    success: true,
    products: { total: 42, active: 38 },
    reviews: { total: 120, averageRating: 4.6 },
    application: { name: "Kings Brew" },
  };

  it("reads a nested number by dot-path", () => {
    expect(getStatValue(stats, "products.total")).toBe(42);
    expect(getStatValue(stats, "reviews.averageRating")).toBe(4.6);
  });

  it("returns undefined for a missing path", () => {
    expect(getStatValue(stats, "brands.total")).toBeUndefined();
    expect(getStatValue(stats, "products.total.deep")).toBeUndefined();
  });

  it("returns undefined when the value is not a number", () => {
    expect(getStatValue(stats, "application.name")).toBeUndefined();
    expect(getStatValue(stats, "products")).toBeUndefined();
  });

  it("returns undefined when stats are not loaded yet", () => {
    expect(getStatValue(undefined, "products.total")).toBeUndefined();
  });
});
