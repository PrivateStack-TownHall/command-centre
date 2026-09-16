import { useQuery } from "@tanstack/react-query";

import { resourceApi, type ResourceParams } from "../api/resource.api";

interface UseApplicationResourceOptions {
  enabled?: boolean;
}

/**
 * Fetches one resource (tab) of one application. Replaces the old
 * useApplicationEntities/Categories/Images/Reviews hooks — since every
 * app now declares its own arbitrary list of resources (see
 * application.config.ts), a single parameterized hook covers all of them.
 */
export function useApplicationResource<T = unknown>(
  appId: string,
  baseUrl: string,
  endpoint: string,
  params?: ResourceParams,
  { enabled = true }: UseApplicationResourceOptions = {},
) {
  return useQuery({
    queryKey: ["resource", appId, endpoint, params],

    queryFn: () => resourceApi.getAll<T>(baseUrl, endpoint, params),

    enabled: enabled && !!baseUrl && !!endpoint,

    staleTime: 1000 * 60 * 5,
  });
}
