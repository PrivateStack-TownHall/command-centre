import PageHeader from "@/components/shared/page/PageHeader";
import ErrorState from "@/components/shared/state/ErrorState";
import SnapshotStatus from "@/components/shared/state/SnapshotStatus";

import { useBffMonitoring } from "@/features/bff/hooks/useBffMonitoring";
import { toHealthRow } from "../utils/health-rows";

import MonitoringStats from "../components/MonitoringStats";
import AuditLogsCard from "../components/AuditLogsCard";
import ApplicationsTable from "../components/ApplicationsTable";
import InfrastructureCard from "../components/InfrastructureCard";

import { useBffDashboard } from "@/features/bff/hooks/useBffDashboard";

function MonitoringPage() {
  // Health of every application in one request, from the BFF's snapshots.
  const { data, isLoading, isError } = useBffMonitoring();

  // The dashboard response carries /monitoring and /activities, which the
  // infrastructure and audit log cards need; both share one cached query.
  const { data: dashboard, isLoading: dashboardLoading } = useBffDashboard();

  const rows = (data?.applications ?? []).map(toHealthRow);

  const summary = data?.summary;
  const monitored = dashboard?.applications.find((app) => app.monitoring);
  // The card labels each row by its source application, which the BFF
  // reports as appName/appEmoji.
  const auditLogs = (dashboard?.latestActivities ?? []).map((activity) => ({
    ...activity,
    application: activity.appName,
    emoji: activity.appEmoji,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <PageHeader
          title="Monitoring Command Centre"
          description="Real-time monitoring, system and health status, audit logs, and infrastructure overview."
        />

        <MonitoringStats
          total={summary?.total ?? 0}
          online={summary?.online ?? 0}
          warning={rows.filter((row) => row.state === "waking").length}
          offline={summary?.offline ?? 0}
        />
      </div>

      {data && (
        <SnapshotStatus
          generatedAt={data.generatedAt}
          oldestAgeSeconds={
            data.applications
              .map((app) => app.ageSeconds)
              .filter((age): age is number => age !== null)
              .sort((a, b) => b - a)[0]
          }
          applications={data.applications}
        />
      )}

      {!isLoading && isError && (
        <ErrorState description="Couldn't reach the Command Centre BFF. Start it with `npm run start:dev` and check VITE_BFF_URL." />
      )}

      {!isError && (
        <div className="grid gap-6 xl:grid-cols-2">
          <AuditLogsCard logs={auditLogs} isLoading={dashboardLoading} />

          <div className="space-y-6">
            <ApplicationsTable rows={rows} />

            <InfrastructureCard
              databaseStatus={monitored?.monitoring?.database.status ?? undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MonitoringPage;
