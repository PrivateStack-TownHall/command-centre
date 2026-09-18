import { useQuery } from "@tanstack/react-query";

import { statsApi } from "../api/stats.api";

/**
 * Fetches an application's stats. `endpoint` comes from the app's
 * `statsEndpoint` config — when it's missing the query stays disabled,
 * since only some backends expose a stats endpoint at all.
 */
export function useApplicationStats(
  appId: string,
  baseUrl: string,
  endpoint: string | undefined,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ["stats", appId, endpoint],
    queryFn: () => statsApi.get(baseUrl, endpoint as string),
    enabled: enabled && !!baseUrl && !!endpoint,
    staleTime: 1000 * 60 * 5,
  });
}
