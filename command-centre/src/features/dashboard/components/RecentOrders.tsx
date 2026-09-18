import { Link } from "react-router-dom";
import { ArrowRight, ShoppingCart } from "lucide-react";

import { PATHS } from "@/app/routes/paths";

import type { CommandCentreApplication } from "../types/command-centre.type";

interface RecentOrdersProps {
  applications: CommandCentreApplication[];
}

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function RecentOrders({ applications }: RecentOrdersProps) {
  const orders = applications
    .flatMap((app) =>
      app.orders.map((order: any) => ({ ...order, application: app.name })),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-semibold">Recent Orders</h2>
            <p className="text-sm text-slate-500">Latest customer orders.</p>
          </div>
        </div>

        <Link
          to={PATHS.ORDERS}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View All Orders
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">
          No orders yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="pb-2 pr-2">#</th>
                <th className="pb-2 pr-2">Customer</th>
                <th className="pb-2 pr-2">Amount</th>
                <th className="pb-2 pr-2">Status</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((order: any) => (
                <tr key={`${order.application}-${order.id}`}>
                  <td className="py-2.5 pr-2 font-medium">
                    #{order.orderNumber?.split("-").pop() ?? order.id}
                  </td>
                  <td className="py-2.5 pr-2 text-slate-600">
                    {order.user?.fullName ?? "-"}
                  </td>
                  <td className="py-2.5 pr-2 font-semibold">
                    Rp {Number(order.totalAmount).toLocaleString("id-ID")}
                  </td>
                  <td className="py-2.5 pr-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        STATUS_STYLE[order.status] ??
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-400">
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentOrders;
