export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  /** Optional in every backend's CreateReviewDto — may be null/missing. */
  comment?: string | null;
  createdAt?: string;

  user?: {
    id: number;
    email: string;
    fullName: string;
  };

  product?: {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
    appType?: string;
    images?: { imageUrl: string }[];
  };
}

/** A review tagged with the application it was fetched from. */
export interface AppReview extends Review {
  appId: string;
  appName: string;
  appEmoji: string;
}
