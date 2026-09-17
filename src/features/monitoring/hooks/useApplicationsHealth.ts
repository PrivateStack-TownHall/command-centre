import { useQueries } from "@tanstack/react-query";

import { APPLICATION_CONFIG } from "@/features/applications/config/application.config";

import { fetchHealth, healthQueryKey } from "../api/health.api";
import { toHealthRow } from "../utils/health-rows";

const APPS = Object.entries(APPLICATION_CONFIG).map(([id, config]) => ({
  id,
  name: config.app.name,
  emoji: config.emoji,
  baseUrl: config.app.url ?? "",
  endpoint: config.healthEndpoint,
}));

const CHECKED_APPS = APPS.filter((app) => app.baseUrl && app.endpoint);

/** Health of every application, one query each, so each row fills in as
 *  soon as that backend answers. */
export function useApplicationsHealth() {
  return useQueries({
    queries: CHECKED_APPS.map((app) => ({
      queryKey: healthQueryKey(app.id),
      queryFn: () => fetchHealth(app.baseUrl, app.endpoint as string),
      // Re-check every 2 minutes while the page is open.
      refetchInterval: 1000 * 60 * 2,
      staleTime: 1000 * 60,
    })),
    combine: (results) =>
      APPS.map((app) => {
        const index = CHECKED_APPS.findIndex((checked) => checked.id === app.id);
        return toHealthRow(app, index === -1 ? undefined : results[index]);
      }),
  });
}
