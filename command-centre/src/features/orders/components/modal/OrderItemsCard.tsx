import { Package2 } from "lucide-react";

import type { Order } from "../../types/order.type";

interface OrderItemsCardProps {
  order: Order;
}

function OrderItemsCard({ order }: OrderItemsCardProps) {
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
    >
      <div
        className="
          border-b
          border-slate-200
          bg-gradient-to-r
          from-violet-50
          to-white
          px-6
          py-5
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-violet-100
            "
          >
            <Package2 className="h-6 w-6 text-violet-600" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Ordered Items</h3>

            <p className="mt-1 text-sm text-slate-500">
              {order.items.length} products purchased
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {order.items.map((item, index) => (
          <div
            key={item.id}
            className="
              flex
              items-center
              justify-between
              px-6
              py-5
              transition-colors
              hover:bg-slate-50
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary/10
                  text-sm
                  font-bold
                  text-primary
                "
              >
                {index + 1}
              </div>

              <div>
                <h4 className="font-semibold text-slate-900">
                  {item.productName}
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Product #{item.productId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-10">
              <div className="text-center">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Price
                </p>

                <p className="mt-1 font-semibold">
                  Rp {Number(item.price).toLocaleString("id-ID")}
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Qty
                </p>

                <span
                  className="
                    mt-1
                    inline-flex
                    rounded-full
                    bg-blue-100
                    px-3
                    py-1
                    text-sm
                    font-semibold
                    text-blue-700
                  "
                >
                  {item.quantity}
                </span>
              </div>

              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Subtotal
                </p>

                <p
                  className="
                    mt-1
                    text-lg
                    font-bold
                    text-primary
                  "
                >
                  Rp {Number(item.subtotal).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="
          flex
          items-center
          justify-between
          border-t
          border-slate-200
          bg-slate-50
          px-6
          py-5
        "
      >
        <div>
          <p className="text-sm text-slate-500">Total Products</p>

          <h3 className="text-xl font-bold">{order.items.length}</h3>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500">Grand Total</p>

          <h2 className="text-3xl font-bold text-primary">
            Rp {Number(order.totalAmount).toLocaleString("id-ID")}
          </h2>
        </div>
      </div>
    </div>
  );
}
export default OrderItemsCard;
