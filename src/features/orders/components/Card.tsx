import { useState } from "react";

import OrderModal from "./Modal";

import type { Order } from "../types/order.type";

interface CardProps {
  order: Order;
}

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_DOT: Record<string, string> = {
  PENDING: "bg-amber-500",
  PAID: "bg-emerald-500",
  PROCESSING: "bg-blue-500",
  COMPLETED: "bg-emerald-500",
  CANCELLED: "bg-red-500",
};

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
];

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Card({ order }: CardProps) {
  const [open, setOpen] = useState(false);

  const payment = order.payments[0];
  const avatarColor = AVATAR_COLORS[order.id % AVATAR_COLORS.length];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          flex
          w-full
          flex-col
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
        <div className="flex items-start justify-between">
          <div>
            <p className="font-bold text-slate-900">#{order.orderNumber}</p>
            <p className="mt-0.5 text-xs text-slate-400">
              {new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              •{" "}
              {new Date(order.createdAt).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[order.status]}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[order.status]}`}
            />
            {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2.5">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor}`}
          >
            {initialsOf(order.user.fullName)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              {order.user.fullName}
            </p>
            <p className="truncate text-xs text-slate-400">
              {order.user.email}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5">
          {order.items.slice(0, 3).map((item) => (
            <img
              key={item.id}
              src="https://placehold.co/64x64"
              alt={item.productName}
              className="h-11 w-11 rounded-lg border border-slate-100 object-cover"
              title={item.productName}
            />
          ))}

          {order.items.length > 3 && (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
              +{order.items.length - 3}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-xs text-slate-400">Total</p>
            <p className="text-lg font-bold text-slate-900">
              Rp {Number(order.totalAmount).toLocaleString("id-ID")}
            </p>
          </div>

          {payment && (
            <div className="text-right">
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                  payment.status === "SUCCESS"
                    ? "bg-emerald-100 text-emerald-700"
                    : payment.status === "FAILED"
                      ? "bg-red-100 text-red-700"
                      : "bg-violet-100 text-violet-700"
                }`}
              >
                {payment.status === "SUCCESS" ? "Paid" : payment.status}
              </span>
              <p className="mt-1 text-xs text-slate-400">
                {payment.method.replaceAll("_", " ")}
              </p>
            </div>
          )}
        </div>
      </button>

      <OrderModal open={open} onOpenChange={setOpen} order={order} />
    </>
  );
}

export default Card;
