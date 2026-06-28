import PageHeader from "@/components/shared/page/PageHeader";

import { services } from "../data/data";

import { useAuditLogs } from "../hooks/useAuditLogs";

import MonitoringStats from "../components/MonitoringStats";
import AuditLogsCard from "../components/AuditLogsCard";
import ServiceHealthCard from "../components/ServiceHealthCard";
import InfrastructureCard from "../components/InfrastructureCard";

function MonitoringPage() {
  const { data, isLoading } = useAuditLogs();

  const onlineCount = services.filter(
    (service) => service.status === "online",
  ).length;

  const warningCount = services.filter(
    (service) => service.status === "warning",
  ).length;

  const offlineCount = services.filter(
    (service) => service.status === "offline",
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitoring Command Centre"
        description="Real-time monitoring, application health status, audit logs, and infrastructure overview."
      />

      <MonitoringStats
        total={services.length}
        online={onlineCount}
        warning={warningCount}
        offline={offlineCount}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <AuditLogsCard logs={data?.data ?? []} isLoading={isLoading} />

        <div className="space-y-6">
          <ServiceHealthCard data={services} />

          <InfrastructureCard />
        </div>
      </div>
    </div>
  );
}

export default MonitoringPage;
