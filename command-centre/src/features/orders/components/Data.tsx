import { useMemo } from "react";

import Main from "./Main";

import type { Order } from "../types/order.type";

interface DataProps {
  orders: Order[];
  search: string;
  status: string;
}

function Data({ orders, search, status }: DataProps) {
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus = status === "ALL" || order.status === status;

      const keyword = search.trim().toLowerCase();

      const matchSearch =
        keyword === "" ||
        order.orderNumber.toLowerCase().includes(keyword) ||
        order.user.fullName.toLowerCase().includes(keyword);

      return matchStatus && matchSearch;
    });
  }, [orders, search, status]);

  return (
    <div className="space-y-6">
      <Main orders={filteredOrders} />
    </div>
  );
}

export default Data;
