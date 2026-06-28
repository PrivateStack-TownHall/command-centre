import { useQuery } from "@tanstack/react-query";

import { getAuditLogs } from "../api/monitoring.api";

export function useAuditLogs() {
  return useQuery({
    queryKey: ["audit-logs"],
    queryFn: getAuditLogs,
  });
}
