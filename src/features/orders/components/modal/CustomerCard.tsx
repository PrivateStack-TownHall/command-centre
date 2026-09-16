import { CalendarDays, Mail, ShieldCheck, User } from "lucide-react";

import type { Order } from "../../types/order.type";

interface CustomerCardProps {
  order: Order;
}

function CustomerCard({ order }: CustomerCardProps) {
  const initials = order.user.fullName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
          from-sky-50
          to-white
          px-5
          py-4
        "
      >
        <h3 className="font-semibold text-slate-900">Customer Information</h3>

        <p className="mt-1 text-sm text-slate-500">
          Customer profile and account information.
        </p>
      </div>

      <div className="space-y-6 p-5">
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-primary/10
              text-xl
              font-bold
              text-primary
            "
          >
            {initials}
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-lg font-semibold">
              {order.user.fullName}
            </h4>

            <p className="truncate text-sm text-slate-500">
              {order.user.email}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-slate-100
              "
            >
              <User className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Full Name
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {order.user.fullName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-slate-100
              "
            >
              <Mail className="h-5 w-5 text-slate-600" />
            </div>

            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Email Address
              </p>

              <p className="mt-1 truncate font-medium text-slate-900">
                {order.user.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-slate-100
              "
            >
              <ShieldCheck className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Role
              </p>

              <span
                className="
                  mt-1
                  inline-flex
                  rounded-full
                  bg-emerald-100
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-emerald-700
                "
              >
                {order.user.role}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-slate-100
              "
            >
              <CalendarDays className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Order Date
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <p className="text-sm text-slate-500">
                {new Date(order.createdAt).toLocaleTimeString("en-GB")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerCard;
