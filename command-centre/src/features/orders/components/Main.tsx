import OrderCard from "./Card";

import type { Order } from "../types/order.type";

interface MainProps {
  orders: Order[];
}

function Main({ orders }: MainProps) {
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

  return (
    <div
      className="
        grid
        gap-5
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

export default Main;
