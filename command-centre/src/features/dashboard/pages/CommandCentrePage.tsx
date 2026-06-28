import PageHeader from "@/components/shared/page/PageHeader";

import ApplicationsOverview from "../components/ApplicationsOverview";
import AuditLogs from "../components/AuditLogs";
import DashboardCards from "../components/DashboardCards";
import LatestUpdates from "../components/LatestUpdates";
import RecentOrders from "../components/RecentOrders";
import RecentReviews from "../components/RecentReviews";

import { useCommandCentre } from "../hooks/useCommandCentre";

function CommandCentrePage() {
  const { data, isLoading } = useCommandCentre();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Centre"
        description="Unified visibility across the Entrepreneur Topics Ecosystem."
      />

      {isLoading || !data ? null : (
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
