import { useQuery } from "@tanstack/react-query";

import { statsApi } from "../api/stats.api";

export function useApplicationStats(
  appId: string,
  baseUrl: string,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: ["stats", appId],
    queryFn: () => statsApi.get(baseUrl),
    enabled: enabled && !!baseUrl,
    staleTime: 1000 * 60 * 5,
  });
}
