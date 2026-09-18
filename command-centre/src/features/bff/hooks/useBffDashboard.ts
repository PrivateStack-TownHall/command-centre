import { bffApi, bffQueryKeys } from "../api/bff.api";

import { useBffQuery } from "./useBffQuery";

/** Everything the Command Centre page shows, in one request. */
export function useBffDashboard() {
  return useBffQuery(bffQueryKeys.dashboard, bffApi.getDashboard);
}
