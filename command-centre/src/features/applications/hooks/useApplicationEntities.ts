import { useQuery } from "@tanstack/react-query";

import { entitiesApi, type EntityParams } from "../api/entities.api";

export function useApplicationEntities(appId: string, params?: EntityParams) {
  return useQuery({
    queryKey: ["entities", appId, params],

    queryFn: () => entitiesApi.getAll(appId, params),
  });
}
