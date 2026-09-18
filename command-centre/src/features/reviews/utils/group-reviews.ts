import type { ProductReview } from "../types/product-review.type";
import type { AppReview } from "../types/review.type";

/**
 * Every application has its own database, so product #1 in Kings Brew and
 * product #1 in Castle Kitchen are different products. The grouping key
 * therefore has to include the application.
 */
export function productReviewKey(appId: string, productId: number): string {
  return `${appId}:${productId}`;
}

/** Mean rating of a list of reviews, weighting every review equally. */
export function averageRatingOf(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;

  return reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
}

/** Groups a flat list of reviews from many applications into one entry
 *  per (application, product). */
export function groupReviewsByProduct(reviews: AppReview[]): ProductReview[] {
  const grouped = new Map<string, ProductReview>();

  for (const review of reviews) {
    const key = productReviewKey(review.appId, review.productId);

    let product = grouped.get(key);

    if (!product) {
      product = {
        key,
        productId: review.productId,
        productName: review.product?.name ?? `Product #${review.productId}`,
        productDescription: review.product?.description ?? "",
        productAppType: review.product?.appType ?? "",
        imageUrl: review.product?.images?.[0]?.imageUrl ?? "",
        reviewUser: review.user?.fullName ?? "Anonymous",
        averageRating: 0,
        totalReviews: 0,
        appId: review.appId,
        appName: review.appName,
        appEmoji: review.appEmoji,
        reviews: [],
      };

      grouped.set(key, product);
    }

    product.reviews.push(review);
  }

  return Array.from(grouped.values()).map((product) => ({
    ...product,
    totalReviews: product.reviews.length,
    averageRating: averageRatingOf(product.reviews),
  }));
}

export type ProductReviewSort = "latest" | "oldest" | "highest" | "lowest";

/** Time of the most recent review of a product (0 when none are dated). */
export function latestReviewTime(product: ProductReview): number {
  return product.reviews.reduce((latest, review) => {
    const time = review.createdAt ? new Date(review.createdAt).getTime() : 0;
    return Number.isNaN(time) ? latest : Math.max(latest, time);
  }, 0);
}

/**
 * Returns a sorted copy. Latest/Oldest order products by their most recent
 * review, so a product that was just reviewed moves to the top.
 */
export function sortProductReviews(
  products: ProductReview[],
  sort: string,
): ProductReview[] {
  const result = [...products];

  switch (sort as ProductReviewSort) {
    case "latest":
      return result.sort((a, b) => latestReviewTime(b) - latestReviewTime(a));
    case "oldest":
      return result.sort((a, b) => latestReviewTime(a) - latestReviewTime(b));
    case "highest":
      return result.sort((a, b) => b.averageRating - a.averageRating);
    case "lowest":
      return result.sort((a, b) => a.averageRating - b.averageRating);
    default:
      return result;
  }
}
