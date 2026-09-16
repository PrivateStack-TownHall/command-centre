import {
  CheckCircle2,
  Clock3,
  LoaderCircle,
  ShoppingCart,
  Wallet,
  XCircle,
} from "lucide-react";

import type { Order } from "../types/order.type";

interface StatisticsProps {
  orders: Order[];
}

function Statistics({ orders }: StatisticsProps) {
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING",
  ).length;

  const paidOrders = orders.filter((order) => order.status === "PAID").length;

  const processingOrders = orders.filter(
    (order) => order.status === "PROCESSING",
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "COMPLETED",
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "CANCELLED",
  ).length;

  const stats = [
    {
      label: "Orders",
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
    },

    {
      label: "Pending",
      value: pendingOrders.toLocaleString(),
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },

    {
      label: "Paid",
      value: paidOrders.toLocaleString(),
      icon: Wallet,
      color: "bg-emerald-50 text-emerald-600",
    },

    {
      label: "Processing",
      value: processingOrders.toLocaleString(),
      icon: LoaderCircle,
      color: "bg-violet-50 text-violet-600",
    },

    {
      label: "Completed",
      value: completedOrders.toLocaleString(),
      icon: CheckCircle2,
      color: "bg-cyan-50 text-cyan-600",
    },

    {
      label: "Cancelled",
      value: cancelledOrders.toLocaleString(),
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3
        xl:grid-cols-6
      "
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              shadow-sm
              transition-all
              hover:shadow-md
            "
          >
            <div
              className={`
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                ${stat.color}
              `}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p
                className="
                  truncate
                  text-xs
                  font-medium
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >
                {stat.label}
              </p>

              <h3
                className="
                  text-xl
                  font-bold
                  text-slate-900
                "
              >
                {stat.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Statistics;
