import PageHeader from "@/components/shared/page/PageHeader";
import Loading from "@/components/shared/Loading";
import EmptyState from "@/components/shared/state/EmptyState";
import ErrorState from "@/components/shared/state/ErrorState";

import ApplicationsOverview from "../components/ApplicationsOverview";
import AuditLogs from "../components/AuditLogs";
import DashboardCards from "../components/DashboardCards";
import LatestUpdates from "../components/LatestUpdates";
import RecentOrders from "../components/RecentOrders";
import RecentReviews from "../components/RecentReviews";

import { useCommandCentre } from "../hooks/useCommandCentre";

function CommandCentrePage() {
  const { data, isLoading, isError } = useCommandCentre();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Centre"
        description="Unified visibility across the Entrepreneur Topics Ecosystem."
      />

      {isLoading && <Loading label="Loading dashboard..." />}

      {!isLoading && isError && (
        <ErrorState description="Couldn't load dashboard data. Please try again shortly." />
      )}

      {!isLoading && !isError && (!data || data.length === 0) && (
        <EmptyState description="No application data available right now." />
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <>
          <DashboardCards applications={data} />

          <div className="grid gap-6 xl:grid-cols-2">
            <LatestUpdates applications={data} />

            <AuditLogs applications={data} />
          </div>

          <ApplicationsOverview applications={data} />

          <div className="grid gap-6 xl:grid-cols-2">
            <RecentOrders applications={data} />

            <RecentReviews applications={data} />
          </div>
        </>
      )}
    </div>
  );
}

export default CommandCentrePage;
