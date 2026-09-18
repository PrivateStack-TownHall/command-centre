import type { Review } from "./review.type";

export interface ProductReview {
  /** Unique across applications: `${appId}:${productId}`. Product ids are
   *  only unique inside one backend, so productId alone is not a key. */
  key: string;
  productId: number;
  productName: string;
  productDescription?: string;
  productAppType?: string;
  imageUrl?: string;
  reviewUser: string;
  averageRating: number;
  totalReviews: number;
  appId?: string;
  appName?: string;
  appEmoji?: string;

  reviews: Review[];
}
