import {
  averageRatingOf,
  groupReviewsByProduct,
  sortProductReviews,
} from "../group-reviews";
import type { AppReview } from "../../types/review.type";

const review = (overrides: Partial<AppReview>): AppReview => ({
  id: 1,
  userId: 1,
  productId: 1,
  rating: 5,
  comment: "Great",
  appId: "kings-brew",
  appName: "Kings Brew",
  appEmoji: "☕",
  ...overrides,
});

describe("groupReviewsByProduct", () => {
  it("keeps the same product id from different apps as separate products", () => {
    const products = groupReviewsByProduct([
      review({ id: 1, productId: 1, appId: "kings-brew", product: { id: 1, name: "Espresso" } }),
      review({ id: 2, productId: 1, appId: "castle-kitchen", appName: "Castle Kitchen", product: { id: 1, name: "Sirloin Steak" } }),
    ]);

    expect(products).toHaveLength(2);
    expect(products.map((p) => p.key)).toEqual(["kings-brew:1", "castle-kitchen:1"]);
    expect(products.map((p) => p.productName)).toEqual(["Espresso", "Sirloin Steak"]);
  });

  it("groups reviews of the same product in the same app", () => {
    const [product] = groupReviewsByProduct([
      review({ id: 1, rating: 5 }),
      review({ id: 2, rating: 3 }),
    ]);

    expect(product.totalReviews).toBe(2);
    expect(product.averageRating).toBe(4);
  });

  it("falls back to a readable name when the product relation is missing", () => {
    const [product] = groupReviewsByProduct([review({ productId: 30 })]);

    expect(product.productName).toBe("Product #30");
  });
});

describe("sortProductReviews", () => {
  const products = groupReviewsByProduct([
    review({ id: 1, productId: 1, rating: 3, createdAt: "2026-06-01T00:00:00.000Z" }),
    review({ id: 2, productId: 2, rating: 5, createdAt: "2026-06-20T00:00:00.000Z" }),
    review({ id: 3, productId: 3, rating: 4, createdAt: "2026-06-10T00:00:00.000Z" }),
    // Product 1 also has a newer review, so its latest activity is 06-15.
    review({ id: 4, productId: 1, rating: 3, createdAt: "2026-06-15T00:00:00.000Z" }),
  ]);

  const ids = (sort: string) => sortProductReviews(products, sort).map((p) => p.productId);

  it("orders by most recent review for latest and oldest", () => {
    expect(ids("latest")).toEqual([2, 1, 3]);
    expect(ids("oldest")).toEqual([3, 1, 2]);
  });

  it("orders by average rating for highest and lowest", () => {
    expect(ids("highest")).toEqual([2, 3, 1]);
    expect(ids("lowest")).toEqual([1, 3, 2]);
  });

  it("does not mutate the input", () => {
    const before = products.map((p) => p.productId);
    sortProductReviews(products, "latest");
    expect(products.map((p) => p.productId)).toEqual(before);
  });
});

describe("averageRatingOf", () => {
  it("weights every review equally, not every product", () => {
    // Product A: one 1-star review. Product B: three 5-star reviews.
    // Averaging the product averages would give 3.0; the real mean is 4.0.
    const reviews = [
      review({ id: 1, productId: 1, rating: 1 }),
      review({ id: 2, productId: 2, rating: 5 }),
      review({ id: 3, productId: 2, rating: 5 }),
      review({ id: 4, productId: 2, rating: 5 }),
    ];

    expect(averageRatingOf(reviews)).toBe(4);
  });

  it("returns 0 when there are no reviews", () => {
    expect(averageRatingOf([])).toBe(0);
  });
});
