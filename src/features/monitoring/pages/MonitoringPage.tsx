import PageHeader from "@/components/shared/page/PageHeader";
import Loading from "@/components/shared/Loading";
import ErrorState from "@/components/shared/state/ErrorState";
import EmptyState from "@/components/shared/state/EmptyState";

import { useCommandCentre } from "@/features/dashboard/hooks/useCommandCentre";

import { useAuditLogs } from "../hooks/useAuditLogs";

import MonitoringStats from "../components/MonitoringStats";
import AuditLogsCard from "../components/AuditLogsCard";
import ServiceHealthCard from "../components/ServiceHealthCard";
import InfrastructureCard from "../components/InfrastructureCard";

function MonitoringPage() {
  const { data, isLoading, isError } = useCommandCentre();
  const { data: auditLogs, isLoading: auditLoading } = useAuditLogs();

  const kingsBrew = data?.[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitoring Command Centre"
        description="Real-time monitoring, application health status, audit logs, and infrastructure overview — sourced from Kings Brew's public endpoints."
      />

      {isLoading && <Loading label="Loading monitoring data..." />}

      {!isLoading && isError && (
        <ErrorState description="Couldn't load monitoring data from Kings Brew." />
      )}

      {!isLoading && !isError && !kingsBrew && (
        <EmptyState description="No monitoring data available right now." />
      )}

      {!isLoading && !isError && kingsBrew && (
        <>
          <MonitoringStats
            status={kingsBrew.health.status}
            databaseStatus={kingsBrew.monitoring.database.status}
            uptimeSeconds={kingsBrew.health.uptime}
            latencyMs={kingsBrew.monitoring.database.latency}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <AuditLogsCard
              logs={auditLogs?.data ?? []}
              isLoading={auditLoading}
            />

            <div className="space-y-6">
              <ServiceHealthCard
                appName={kingsBrew.name}
                emoji={kingsBrew.emoji}
                status={kingsBrew.health.status}
                version={kingsBrew.health.version}
                uptimeSeconds={kingsBrew.health.uptime}
                environment={kingsBrew.monitoring.node.environment}
                platform={kingsBrew.monitoring.node.platform}
                nodeVersion={kingsBrew.monitoring.node.version}
              />

              <InfrastructureCard
                databaseStatus={kingsBrew.monitoring.database.status}
                latencyMs={kingsBrew.monitoring.database.latency}
                memory={kingsBrew.monitoring.memory}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MonitoringPage;
