import PageHeader from "@/components/shared/page/PageHeader";
import Loading from "@/components/shared/Loading";
import ErrorState from "@/components/shared/state/ErrorState";

import { useCommandCentre } from "@/features/dashboard/hooks/useCommandCentre";
import { APPLICATIONS } from "@/lib/constants";

import { useAuditLogs } from "../hooks/useAuditLogs";

import MonitoringStats from "../components/MonitoringStats";
import AuditLogsCard from "../components/AuditLogsCard";
import ApplicationsTable from "../components/ApplicationsTable";
import InfrastructureCard from "../components/InfrastructureCard";

function MonitoringPage() {
  const { data, isLoading, isError } = useCommandCentre();
  const { data: auditLogs, isLoading: auditLoading } = useAuditLogs();

  const kingsBrew = data?.[0];
  const isUp = kingsBrew?.health.status === "UP";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <PageHeader
          title="Monitoring Command Centre"
          description="Real-time monitoring, system and health status, audit logs, and infrastructure overview."
        />

        {!isLoading && !isError && (
          <MonitoringStats
            total={APPLICATIONS.length}
            online={isUp ? 1 : 0}
            warning={0}
            offline={kingsBrew && !isUp ? 1 : 0}
          />
        )}
      </div>

      {isLoading && <Loading label="Loading monitoring data..." />}

      {!isLoading && isError && (
        <ErrorState description="Couldn't load monitoring data from Kings Brew." />
      )}

      {!isLoading && !isError && (
        <div className="grid gap-6 xl:grid-cols-2">
          <AuditLogsCard
            logs={auditLogs?.data ?? []}
            isLoading={auditLoading}
          />

          <div className="space-y-6">
            <ApplicationsTable
              totalCount={APPLICATIONS.length}
              kingsBrew={
                kingsBrew
                  ? {
                      status: kingsBrew.health.status,
                      uptimeSeconds: kingsBrew.health.uptime,
                      latencyMs: kingsBrew.monitoring.database.latency,
                    }
                  : undefined
              }
            />

            <InfrastructureCard
              databaseStatus={kingsBrew?.monitoring.database.status}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MonitoringPage;
