import { useMemo, useState } from "react";

import PageHeader from "@/components/shared/page/PageHeader";
import { StatsSkeleton } from "@/components/shared/filters/FeedSkeleton";
import { ALL_OPTION } from "@/components/shared/filters/FilterSelect";
import type { FeedView } from "@/components/shared/filters/ViewToggle";

import ApplicationLoadStatus from "@/features/applications/components/ApplicationLoadStatus";

import Data from "../components/Data";
import Statistics from "../components/Statistics";
import Toolbar from "../components/Toolbar";

import { useOrders } from "../hooks/useOrders";

function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL_OPTION);
  const [application, setApplication] = useState(ALL_OPTION);
  const [sort, setSort] = useState("latest");
  const [view, setView] = useState<FeedView>("grid");
  const [page, setPage] = useState(1);

  // Orders from every app with a live `publicEndpoints.orders` (see
  // application.config.ts); apps still "Coming soon" can't be picked.
  const { data: orders, isLoading, statuses, retryFailed } = useOrders();

  // Stats follow the application filter, like on the Reviews page.
  const applicationOrders = useMemo(
    () =>
      application === ALL_OPTION
        ? orders
        : orders.filter((order) => order.appId === application),
    [orders, application],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <PageHeader
          title="Orders"
          description="Monitor customer orders across the Entrepreneur Topics Ecosystem."
        />

        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <Statistics orders={applicationOrders} />
        )}
      </div>

      <Toolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        status={status}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        application={application}
        onApplicationChange={(value) => {
          setApplication(value);
          setPage(1);
        }}
        sort={sort}
        onSortChange={(value) => {
          setSort(value);
          setPage(1);
        }}
        //   setPage(1);
        // }}
        //   setPage(1);
        // }}
        view={view}
        onViewChange={setView}
      />

      <ApplicationLoadStatus statuses={statuses} onRetry={retryFailed} />

      <Data
        orders={applicationOrders}
        isLoading={isLoading}
        search={search}
        status={status}
        sort={sort}
        view={view}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
}

export default OrdersPage;
