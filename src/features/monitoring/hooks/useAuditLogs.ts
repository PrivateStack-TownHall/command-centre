import { useQuery } from "@tanstack/react-query";

import { getAuditLogs } from "../api/monitoring.api";

export function useAuditLogs() {
  return useQuery({
    queryKey: ["audit-logs"],
    queryFn: getAuditLogs,
    enabled: !!import.meta.env.VITE_AUDIT_LOG_URL,
  });
}
