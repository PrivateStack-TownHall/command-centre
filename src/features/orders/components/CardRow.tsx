import { useState } from "react";

import {
  BadgeCheck,
  ChevronRight,
  Clock3,
  Package,
  ShoppingBag,
} from "lucide-react";

import OrderModal from "./Modal";

import type { Order } from "../types/order.type";

interface CardRowProps {
  order: Order;
}

function CardRow({ order }: CardRowProps) {
  const [open, setOpen] = useState(false);

  const statusBadge = {
    PENDING: "bg-amber-100 text-amber-700",
    PAID: "bg-emerald-100 text-emerald-700",
    PROCESSING: "bg-violet-100 text-violet-700",
    COMPLETED: "bg-sky-100 text-sky-700",
    CANCELLED: "bg-red-100 text-red-700",
  }[order.status];

  const StatusIcon = order.status === "CANCELLED" ? Clock3 : BadgeCheck;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          flex
          w-full
          items-center
          justify-between
          gap-4
          rounded-xl
          border
          border-slate-200
          bg-white
          p-4
          text-left
          shadow-sm
          transition-all
          hover:-translate-y-0.5
          hover:shadow-md
        "
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">
              {order.orderNumber}
            </p>
            <p className="truncate text-sm text-slate-500">
              {order.user.fullName} · {order.items.length} item(s)
            </p>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-2 text-sm text-slate-500 sm:flex">
          <Package className="h-4 w-4" />
          {new Date(order.createdAt).toLocaleDateString("en-GB")}
        </div>

        <span
          className={`hidden shrink-0 rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex ${statusBadge}`}
        >
          <StatusIcon className="mr-1 h-3.5 w-3.5" />
          {order.status}
        </span>

        <p className="w-28 shrink-0 text-right font-bold text-primary">
          Rp {Number(order.totalAmount).toLocaleString("id-ID")}
        </p>

        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
      </button>

      <OrderModal open={open} onOpenChange={setOpen} order={order} />
    </>
  );
}

export default CardRow;
