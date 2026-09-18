import { usePublicFeatureData } from "@/features/applications/hooks/usePublicFeatureData";

import { fetchApplicationReviews } from "../api/reviews.api";
import { REVIEW_APPLICATIONS } from "../config/review.config";

/** Reviews from every application with a live reviews endpoint. */
export function useProductReviews() {
  return usePublicFeatureData(
    "reviews",
    REVIEW_APPLICATIONS,
    fetchApplicationReviews,
  );
}
