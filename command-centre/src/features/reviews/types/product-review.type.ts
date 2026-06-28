import type { Review } from "./review.type";

export interface ProductReview {
  productId: number;
  productName: string;
  productDescription?: string;
  productAppType?: string;
  imageUrl?: string;
  reviewUser: string;
  averageRating: number;
  totalReviews: number;

  reviews: Review[];
}
