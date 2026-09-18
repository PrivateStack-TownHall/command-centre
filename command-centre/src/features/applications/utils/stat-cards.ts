import { getStatValue, type StatsResponse } from "../api/stats.api";
import type { ResourceStatCard } from "../components/ResourceStatCards";
import type { ResourceConfig } from "../config/application.config";

export interface StatCardSources {
  stats: StatsResponse | undefined;
  isStatsLoading: boolean;
  /** Key of the paginated resource counted via a one-row request. */
  countOnlyKey: string | undefined;
  countOnlyTotal: number | undefined;
  isCountOnlyLoading: boolean;
  /** Rows already loaded for a resource (its tab, or a dropdown using it). */
  getLoadedRowCount: (resource: ResourceConfig) => number | undefined;
  /** Whether that resource's list is being fetched right now. */
  isLoadingRows: (resource: ResourceConfig) => boolean;
}

/**
 * Builds the resource cards with each count taken from the best source:
 *  1. the app's /stats endpoint (statsKey)
 *  2. meta.total of a one-row request (paginated resource without stats)
 *  3. rows already loaded when that tab was opened (anything else)
 */
export function buildStatCards(
  resources: ResourceConfig[],
  sources: StatCardSources,
): ResourceStatCard[] {
  return resources.map((resource) => {
    const card = {
      key: resource.key,
      label: resource.label,
      icon: resource.icon,
      locked: !!resource.requiresAuth,
    };

    if (resource.statsKey) {
      return {
        ...card,
        count: getStatValue(sources.stats, resource.statsKey),
        isCountLoading: sources.isStatsLoading,
      };
    }

    if (resource.key === sources.countOnlyKey) {
      return {
        ...card,
        count: sources.countOnlyTotal,
        isCountLoading: sources.isCountOnlyLoading,
      };
    }

    return {
      ...card,
      count: sources.getLoadedRowCount(resource),
      isCountLoading: sources.isLoadingRows(resource),
    };
  });
}
