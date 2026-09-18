import { useCallback, useMemo } from "react";
import { useQueries, type UseQueryResult } from "@tanstack/react-query";

import type {
  PublicFeature,
  PublicFeatureApplication,
} from "../utils/public-endpoints";

export type ApplicationLoadState = "loading" | "ready" | "error";

export interface ApplicationLoadStatus {
  id: string;
  name: string;
  emoji: string;
  state: ApplicationLoadState;
}

/** Shared by every page that shows a feature's data (Reviews page,
 *  dashboard, ...) so the same app is only fetched once. */
export const publicFeatureQueryKey = (feature: PublicFeature, appId: string) =>
  ["public", feature, appId] as const;

/**
 * One query per application instead of one query for all of them: apps
 * that answer quickly show up straight away, and a sleeping Render
 * instance only delays (or fails) its own data.
 */
export function usePublicFeatureData<T>(
  feature: PublicFeature,
  applications: PublicFeatureApplication[],
  fetchApplication: (app: PublicFeatureApplication) => Promise<T[]>,
) {
  const available = useMemo(
    () =>
      applications.filter((app) => app.status === "available" && app.endpoint),
    [applications],
  );

  const combine = useCallback(
    (results: UseQueryResult<T[]>[]) => ({
      data: results.flatMap((result) => result.data ?? []),
      statuses: available.map<ApplicationLoadStatus>((app, index) => ({
        id: app.id,
        name: app.name,
        emoji: app.emoji,
        state: results[index]?.isSuccess
          ? "ready"
          : results[index]?.isError
            ? "error"
            : "loading",
      })),
      // Only a full-page skeleton while nothing has arrived yet.
      isLoading:
        !results.some((result) => result.isSuccess) &&
        results.some((result) => result.isPending),
      retryFailed: () => {
        results
          .filter((result) => result.isError)
          .forEach((result) => void result.refetch());
      },
    }),
    [available],
  );

  return useQueries({
    queries: available.map((app) => ({
      queryKey: publicFeatureQueryKey(feature, app.id),
      queryFn: () => fetchApplication(app),
    })),
    combine,
  });
}
