import { useMemo } from "react";

import PageHeader from "@/components/shared/page/PageHeader";
import Loading from "@/components/shared/Loading";
import EmptyState from "@/components/shared/state/EmptyState";
import ErrorState from "@/components/shared/state/ErrorState";
import SnapshotStatus from "@/components/shared/state/SnapshotStatus";

import { useBffDashboard } from "@/features/bff/hooks/useBffDashboard";
import { toCommandCentreApplications } from "@/features/bff/utils/to-command-centre";

import ApplicationsOverview from "../components/ApplicationsOverview";
import AuditLogs from "../components/AuditLogs";
import DashboardCards from "../components/DashboardCards";
import LatestUpdates from "../components/LatestUpdates";
import RecentOrders from "../components/RecentOrders";
import RecentReviews from "../components/RecentReviews";

function CommandCentrePage() {
  // One request to the BFF replaces ~10 calls per application: it answers
  // from stored snapshots and refreshes stale ones in the background.
  const { data, isLoading, isError } = useBffDashboard();

  const applications = useMemo(
    () => (data ? toCommandCentreApplications(data) : []),
    [data],
  );

  const ages = (data?.applications ?? [])
    .map((app) => app.ageSeconds)
    .filter((age): age is number => age !== null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Centre"
        description="Unified visibility across the Entrepreneur Topics Ecosystem."
      />

      {data && (
        <SnapshotStatus
          generatedAt={data.generatedAt}
          oldestAgeSeconds={ages.length > 0 ? Math.max(...ages) : undefined}
          applications={data.applications}
        />
      )}

      {isLoading && <Loading label="Loading dashboard..." />}

      {!isLoading && isError && (
        <ErrorState description="Couldn't reach the Command Centre BFF. Start it with `npm run start:dev` and check VITE_BFF_URL." />
      )}

      {!isLoading && !isError && applications.length === 0 && (
        <EmptyState description="No application data available right now." />
      )}

      {!isLoading && !isError && applications.length > 0 && (
        <>
          <DashboardCards applications={applications} />

          <div className="grid gap-6 xl:grid-cols-2">
            <LatestUpdates applications={applications} />

            <AuditLogs applications={applications} />
          </div>

          <ApplicationsOverview applications={applications} />

          <div className="grid gap-6 xl:grid-cols-2">
            <RecentOrders applications={applications} />

            <RecentReviews applications={applications} />
          </div>
        </>
      )}
    </div>
  );
}

export default CommandCentrePage;
