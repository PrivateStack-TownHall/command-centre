import OrderCard from "./Card";
import CardRow from "./CardRow";

import type { Order } from "../types/order.type";

interface MainProps {
  orders: Order[];
  view: "grid" | "list";
}

function Main({ orders, view }: MainProps) {
  if (orders.length === 0) {
    return (
      <div
        className="
          flex
          h-72
          items-center
          justify-center
          rounded-xl
          border
          border-dashed
          border-slate-300
          bg-white
        "
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold">No Orders Found</h3>

          <p className="mt-2 text-sm text-slate-500">
            There are no customer orders available.
          </p>
        </div>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="space-y-3">
        {orders.map((order) => (
          <CardRow key={order.id} order={order} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="
        grid
        gap-5
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

export default Main;
