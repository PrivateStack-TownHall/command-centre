import { useMemo } from "react";

import Main from "./Main";
import ApplicationPagination from "@/features/applications/components/ApplicationPagination";

import type { Order } from "../types/order.type";

const ITEMS_PER_PAGE = 8;

interface DataProps {
  orders: Order[];
  search: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  view: "grid" | "list";
  page: number;
  onPageChange: (page: number) => void;
}

function Data({
  orders,
  search,
  status,
  dateFrom,
  dateTo,
  view,
  page,
  onPageChange,
}: DataProps) {
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus = status === "ALL" || order.status === status;

      const keyword = search.trim().toLowerCase();

      const matchSearch =
        keyword === "" ||
        order.orderNumber.toLowerCase().includes(keyword) ||
        order.user.fullName.toLowerCase().includes(keyword);

      const orderDate = new Date(order.createdAt).getTime();

      const matchFrom = !dateFrom || orderDate >= new Date(dateFrom).getTime();
      const matchTo =
        !dateTo || orderDate <= new Date(dateTo).getTime() + 86400000 - 1;

      return matchStatus && matchSearch && matchFrom && matchTo;
    });
  }, [orders, search, status, dateFrom, dateTo]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);

  const paginatedOrders = filteredOrders.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Orders</h3>
          <p className="text-sm text-slate-500">
            Showing{" "}
            {filteredOrders.length === 0
              ? 0
              : (safePage - 1) * ITEMS_PER_PAGE + 1}
            –{Math.min(safePage * ITEMS_PER_PAGE, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
          </p>
        </div>
      </div>

      <Main orders={paginatedOrders} view={view} />

      <ApplicationPagination
        page={safePage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default Data;
