import { useState } from "react";

import PageHeader from "@/components/shared/page/PageHeader";

import Data from "../components/Data";
import Statistics from "../components/Statistics";
import Toolbar from "../components/Toolbar";

import { useOrders } from "../hooks/useOrders";

function OrdersPage() {
  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [application, setApplication] = useState("COFFEE");

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
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        application={application}
        onApplicationChange={setApplication}
      />

      <Data orders={orders} search={search} status={status} />
    </div>
  );
}

export default OrdersPage;
