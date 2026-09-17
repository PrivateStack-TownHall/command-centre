import { useQuery } from "@tanstack/react-query";

import PageHeader from "@/components/shared/page/PageHeader";

import { APPLICATION_CONFIG } from "@/features/applications/config/application.config";

import { useAuditLogs } from "../hooks/useAuditLogs";
import { useApplicationsHealth } from "../hooks/useApplicationsHealth";
import { fetchMonitoring, monitoringQueryKey } from "../api/health.api";
import { summarizeHealth } from "../utils/health-rows";

import MonitoringStats from "../components/MonitoringStats";
import AuditLogsCard from "../components/AuditLogsCard";
import ApplicationsTable from "../components/ApplicationsTable";
import InfrastructureCard from "../components/InfrastructureCard";

// GET /monitoring (database status) only exists on Kings Brew today.
const MONITORED_APP = APPLICATION_CONFIG["kings-brew"];

function MonitoringPage() {
  const { data: auditLogs, isLoading: auditLoading } = useAuditLogs();

  // One health query per application — rows fill in as each backend wakes.
  const healthRows = useApplicationsHealth();
  const summary = summarizeHealth(healthRows);

  const monitoringQuery = useQuery({
    queryKey: monitoringQueryKey("kings-brew"),
    queryFn: () => fetchMonitoring(MONITORED_APP.app.url),
    enabled: !!MONITORED_APP.app.url,
  });

  const database = monitoringQuery.data?.database as
    | { status?: string }
    | undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <PageHeader
          title="Monitoring Command Centre"
          description="Real-time monitoring, system and health status, audit logs, and infrastructure overview."
        />

        <MonitoringStats
          total={summary.total}
          online={summary.online}
          warning={summary.waking}
          offline={summary.offline}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AuditLogsCard logs={auditLogs?.data ?? []} isLoading={auditLoading} />

        <div className="space-y-6">
          <ApplicationsTable rows={healthRows} />

          <InfrastructureCard databaseStatus={database?.status} />
        </div>
      </div>
    </div>
  );
}

export default MonitoringPage;
