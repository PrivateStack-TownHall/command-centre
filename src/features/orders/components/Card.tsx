import { useState } from "react";

import {
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  Clock3,
  CreditCard,
  Package,
  ShoppingBag,
  User,
} from "lucide-react";

import OrderModal from "./Modal";

import type { Order } from "../types/order.type";

interface CardProps {
  order: Order;
}

function Card({ order }: CardProps) {
  const [open, setOpen] = useState(false);

  const payment = order.payments[0];

  const statusConfig = {
    PENDING: {
      badge: "bg-amber-100 text-amber-700 border border-amber-200",
      gradient: "from-amber-50 via-yellow-50 to-white",
      icon: Clock3,
    },

    PAID: {
      badge: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      gradient: "from-emerald-50 via-green-50 to-white",
      icon: BadgeCheck,
    },

    PROCESSING: {
      badge: "bg-violet-100 text-violet-700 border border-violet-200",
      gradient: "from-violet-50 via-purple-50 to-white",
      icon: Package,
    },

    COMPLETED: {
      badge: "bg-sky-100 text-sky-700 border border-sky-200",
      gradient: "from-sky-50 via-cyan-50 to-white",
      icon: BadgeCheck,
    },

    CANCELLED: {
      badge: "bg-red-100 text-red-700 border border-red-200",
      gradient: "from-red-50 via-rose-50 to-white",
      icon: Clock3,
    },
  }[order.status];

  const StatusIcon = statusConfig.icon;

  return (
    <>
      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        <div
          className={`
            bg-gradient-to-br
            ${statusConfig.gradient}
            p-5
          `}
        >
          <div className="flex items-start justify-between">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-white
                shadow-sm
              "
            >
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>

            <div
              className={`
                flex
                items-center
                gap-1
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ${statusConfig.badge}
              `}
            >
              <StatusIcon className="h-3.5 w-3.5" />

              {order.status}
            </div>
          </div>

          <h3 className="mt-6 truncate text-lg font-bold text-slate-900">
            {order.orderNumber}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <User className="h-4 w-4" />

            {order.user.fullName}
          </div>

          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays className="h-4 w-4" />

            {new Date(order.createdAt).toLocaleDateString("en-GB")}
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Total Amount
            </p>

            <h2 className="mt-1 text-3xl font-bold text-primary">
              Rp {Number(order.totalAmount).toLocaleString("id-ID")}
            </h2>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />

              <span className="text-sm font-semibold">
                {order.items.length} Items
              </span>
            </div>

            <div className="space-y-2">
              {order.items.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="
                    flex
                    items-center
                    justify-between
                    text-sm
                  "
                >
                  <span className="truncate text-slate-600">
                    {item.productName}
                  </span>

                  <span className="rounded bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
                    ×{item.quantity}
                  </span>
                </div>
              ))}

              {order.items.length > 3 && (
                <div className="pt-1 text-xs font-medium text-primary">
                  +{order.items.length - 3} more items
                </div>
              )}
            </div>
          </div>

          {payment && (
            <div
              className="
                flex
                items-center
                justify-between
                rounded-xl
                border
                border-slate-100
                bg-white
                p-4
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-emerald-50
                  "
                >
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <p className="text-xs text-slate-400">Payment</p>

                  <p className="text-sm font-semibold">
                    {payment.method.replaceAll("_", " ")}
                  </p>
                </div>
              </div>

              <span
                className="
                  rounded-full
                  bg-emerald-100
                  px-2.5
                  py-1
                  text-xs
                  font-semibold
                  text-emerald-700
                "
              >
                {payment.status}
              </span>
            </div>
          )}

          <button
            onClick={() => setOpen(true)}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-200
              bg-white
              py-3
              text-sm
              font-semibold
              transition-all
              hover:border-primary
              hover:bg-primary
              hover:text-white
            "
          >
            View Details
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <OrderModal open={open} onOpenChange={setOpen} order={order} />
    </>
  );
}

export default Card;
