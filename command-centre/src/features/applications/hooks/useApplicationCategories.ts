import { useQuery } from "@tanstack/react-query";

import { categoriesApi } from "../api/categories.api";

export function useApplicationCategories(appId: string) {
  return useQuery({
    queryKey: ["categories", appId],

    queryFn: () => categoriesApi.getAll(appId),

    staleTime: 1000 * 60 * 5,
  });
}
