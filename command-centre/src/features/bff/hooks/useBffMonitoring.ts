import { bffApi, bffQueryKeys } from "../api/bff.api";

import { useBffQuery } from "./useBffQuery";

/** Health of every application, from the same snapshots as the dashboard. */
export function useBffMonitoring() {
  return useBffQuery(bffQueryKeys.monitoring, bffApi.getMonitoring);
}
