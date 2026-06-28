import { useQuery } from "@tanstack/react-query";

import { reviewsApi } from "../api/reviews.api";

export function useProductReviews() {
  return useQuery({
    queryKey: ["reviews"],

    queryFn: reviewsApi.getAll,

    staleTime: 1000 * 60 * 5,
  });
}
