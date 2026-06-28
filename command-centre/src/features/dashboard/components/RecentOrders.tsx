import { ShoppingCart } from "lucide-react";

import type { CommandCentreApplication } from "../types/command-centre.type";

interface RecentOrdersProps {
  applications: CommandCentreApplication[];
}

function RecentOrders({ applications }: RecentOrdersProps) {
  const orders = applications
    .flatMap((app) =>
      app.orders.map((order: any) => ({
        ...order,
        application: app.name,
        emoji: app.emoji,
      })),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <ShoppingCart className="h-5 w-5 text-primary" />

        <div>
          <h2 className="font-semibold">Recent Orders</h2>

          <p className="text-sm text-slate-500">Latest customer orders.</p>
        </div>
      </div>

      <div className="space-y-3">
        {orders.map((order: any) => (
          <div
            key={`${order.application}-${order.id}`}
            className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{order.emoji}</div>

              <div>
                <h3 className="font-medium">{order.orderNumber}</h3>

                <p className="text-sm text-slate-500">{order.application}</p>

                <p className="text-xs text-slate-400">{order.status}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                Rp {Number(order.totalAmount).toLocaleString("id-ID")}
              </p>

              <p className="text-xs text-slate-400">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentOrders;
