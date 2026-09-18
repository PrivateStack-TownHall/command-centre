import { useQuery } from "@tanstack/react-query";

/**
 * Shared settings for the BFF pages. The BFF answers from snapshots, so a
 * response can arrive while some applications are still being refreshed —
 * in that case we poll every few seconds until every one has answered.
 */
export function useBffQuery<T extends { applications: Array<{ refreshing: boolean }> }>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
) {
  return useQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 30,
    // The BFF is either up or not; no point retrying like a sleeping backend.
    retry: 1,
    refetchInterval: (query) =>
      query.state.data?.applications.some((app) => app.refreshing) ? 5000 : false,
  });
}
