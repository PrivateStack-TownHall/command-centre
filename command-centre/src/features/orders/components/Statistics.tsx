import { CheckCircle2, Clock3, ShoppingCart, XCircle } from "lucide-react";

import type { Order } from "../types/order.type";

interface StatisticsProps {
  orders: Order[];
}

function Statistics({ orders }: StatisticsProps) {
  const totalOrders = orders.length;

  const completedOrders = orders.filter(
    (order) => order.status === "COMPLETED",
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING",
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "CANCELLED",
  ).length;

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Completed",
      value: completedOrders.toLocaleString(),
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Pending",
      value: pendingOrders.toLocaleString(),
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Cancelled",
      value: cancelledOrders.toLocaleString(),
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div key={stat.label} className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stat.color}`}
            >
              <Icon className="h-4.5 w-4.5" />
            </div>

            <div>
              <p className="text-lg font-bold leading-none text-slate-900">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Statistics;
