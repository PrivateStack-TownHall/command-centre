import { useQuery } from "@tanstack/react-query";

import { imagesApi } from "../api/images.api";

export function useApplicationImages(appId: string) {
  return useQuery({
    queryKey: ["images", appId],

    queryFn: () => imagesApi.getAll(appId),

    staleTime: 1000 * 60 * 5,
  });
}
