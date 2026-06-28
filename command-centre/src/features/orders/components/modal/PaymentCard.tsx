import { BadgeCheck, CalendarClock, CreditCard, Wallet } from "lucide-react";

import type { Order } from "../../types/order.type";

interface PaymentCardProps {
  order: Order;
}

function PaymentCard({ order }: PaymentCardProps) {
  const payment = order.payments[0];

  if (!payment) {
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
            from-emerald-50
            to-white
            px-5
            py-4
          "
        >
          <h3 className="font-semibold">Payment Information</h3>

          <p className="mt-1 text-sm text-slate-500">
            Payment details are not available.
          </p>
        </div>

        <div className="p-6 text-center text-sm text-slate-500">
          No payment record found.
        </div>
      </div>
    );
  }

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
          from-emerald-50
          to-white
          px-5
          py-4
        "
      >
        <h3 className="font-semibold">Payment Information</h3>

        <p className="mt-1 text-sm text-slate-500">
          Transaction and payment summary.
        </p>
      </div>

      <div className="space-y-5 p-5">
        <div
          className="
            rounded-2xl
            bg-gradient-to-r
            from-emerald-500
            to-green-600
            p-5
            text-white
          "
        >
          <div className="flex items-center justify-between">
            <Wallet className="h-8 w-8 opacity-90" />

            <span
              className="
                rounded-full
                bg-white/20
                px-3
                py-1
                text-xs
                font-semibold
              "
            >
              {payment.status}
            </span>
          </div>

          <p className="mt-6 text-sm text-white/80">Payment Amount</p>

          <h2 className="mt-1 text-3xl font-bold">
            Rp {Number(payment.amount).toLocaleString("id-ID")}
          </h2>
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
              <CreditCard className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Payment Method
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {payment.method.replaceAll("_", " ")}
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
              <BadgeCheck className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Payment Status
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
                {payment.status}
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
              <CalendarClock className="h-5 w-5 text-slate-600" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Paid At
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {payment.paidAt
                  ? new Date(payment.paidAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </p>

              {payment.paidAt && (
                <p className="text-sm text-slate-500">
                  {new Date(payment.paidAt).toLocaleTimeString("en-GB")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentCard;
