import { BadgeDollarSign, Package, ShoppingCart } from "lucide-react";

import type { Order } from "../../types/order.type";

interface SummaryCardProps {
  order: Order;
}

function SummaryCard({ order }: SummaryCardProps) {
  const totalQuantity = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const totalProducts = order.items.length;

  const totalSubtotal = order.items.reduce(
    (sum, item) => sum + Number(item.subtotal),
    0,
  );

  const cards = [
    {
      label: "Products",
      value: totalProducts.toLocaleString(),
      icon: Package,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Quantity",
      value: totalQuantity.toLocaleString(),
      icon: ShoppingCart,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Grand Total",
      value: `Rp ${Number(order.totalAmount).toLocaleString("id-ID")}`,
      icon: BadgeDollarSign,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

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
          from-orange-50
          to-white
          px-5
          py-4
        "
      >
        <h3 className="font-semibold text-slate-900">Order Summary</h3>

        <p className="mt-1 text-sm text-slate-500">
          Quick overview of this order.
        </p>
      </div>

      <div className="space-y-4 p-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                border
                border-slate-100
                p-4
                transition-colors
                hover:bg-slate-50
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    ${card.color}
                  `}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    {card.label}
                  </p>

                  <h4 className="mt-1 font-semibold text-slate-900">
                    {card.value}
                  </h4>
                </div>
              </div>
            </div>
          );
        })}

        <div
          className="
            rounded-2xl
            bg-gradient-to-r
            from-primary
            to-primary/90
            p-5
            text-white
          "
        >
          <p className="text-sm text-white/80">Order Value</p>

          <h2 className="mt-2 text-3xl font-bold">
            Rp {Number(order.totalAmount).toLocaleString("id-ID")}
          </h2>

          <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-4">
            <div>
              <p className="text-xs text-white/70">Total Items</p>

              <p className="font-semibold">{totalQuantity}</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-white/70">Subtotal</p>

              <p className="font-semibold">
                Rp {totalSubtotal.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
