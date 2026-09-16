import { useState } from "react";

import PageHeader from "@/components/shared/page/PageHeader";

import Data from "../components/Data";
import Statistics from "../components/Statistics";
import Toolbar from "../components/Toolbar";

import { useOrders } from "../hooks/useOrders";

function OrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [application, setApplication] = useState("kings-brew");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  // Only Kings Brew has a real /public/orders endpoint today — switching
  // the dropdown to another app returns an empty list gracefully rather
  // than erroring, until that app exposes the same public endpoint.
  const { data: orders = [], isLoading } = useOrders(application);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Orders"
          description="Monitor customer orders across the Entrepreneur Topics Ecosystem."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Monitor customer orders across the Entrepreneur Topics Ecosystem."
      />

      <Statistics orders={orders} />

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
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={(value) => {
          setDateFrom(value);
          setPage(1);
        }}
        onDateToChange={(value) => {
          setDateTo(value);
          setPage(1);
        }}
        view={view}
        onViewChange={setView}
      />

      <Data
        orders={orders}
        search={search}
        status={status}
        dateFrom={dateFrom}
        dateTo={dateTo}
        view={view}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
}

export default OrdersPage;
