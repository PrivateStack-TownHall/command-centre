import {
  BadgeCheck,
  Circle,
  Clock3,
  LoaderCircle,
  PackageCheck,
  XCircle,
} from "lucide-react";

import type { OrderHistory } from "../../types/order.type";

interface TimelineProps {
  histories: OrderHistory[];
}

function Timeline({ histories }: TimelineProps) {
  const getStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          icon: Clock3,
          title: "Order Created",
          color: "bg-amber-100 text-amber-600",
          border: "border-amber-200",
        };

      case "PROCESSING":
        return {
          icon: LoaderCircle,
          title: "Processing",
          color: "bg-violet-100 text-violet-600",
          border: "border-violet-200",
        };

      case "PAID":
        return {
          icon: BadgeCheck,
          title: "Payment Success",
          color: "bg-emerald-100 text-emerald-600",
          border: "border-emerald-200",
        };

      case "COMPLETED":
        return {
          icon: PackageCheck,
          title: "Completed",
          color: "bg-sky-100 text-sky-600",
          border: "border-sky-200",
        };

      case "CANCELLED":
        return {
          icon: XCircle,
          title: "Cancelled",
          color: "bg-red-100 text-red-600",
          border: "border-red-200",
        };

      default:
        return {
          icon: Circle,
          title: status,
          color: "bg-slate-100 text-slate-600",
          border: "border-slate-200",
        };
    }
  };

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
          from-cyan-50
          to-white
          px-6
          py-5
        "
      >
        <h3 className="font-semibold text-slate-900">Order Timeline</h3>

        <p className="mt-1 text-sm text-slate-500">
          Complete activity history for this order.
        </p>
      </div>

      <div className="p-6">
        <div className="relative">
          {histories.map((history, index) => {
            const config = getStatus(history.status);

            const Icon = config.icon;

            const isLast = index === histories.length - 1;

            return (
              <div key={history.id} className="relative flex gap-5 pb-8">
                {!isLast && (
                  <div
                    className="
                      absolute
                      left-[22px]
                      top-12
                      h-full
                      w-0.5
                      bg-slate-200
                    "
                  />
                )}

                <div
                  className={`
                    relative
                    z-10
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    ${config.border}
                    ${config.color}
                  `}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div
                  className="
                    flex-1
                    rounded-2xl
                    border
                    border-slate-200
                    bg-slate-50
                    p-4
                    transition-all
                    hover:border-primary/20
                    hover:bg-white
                    hover:shadow-sm
                  "
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {config.title}
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {history.notes ?? "-"}
                      </p>
                    </div>

                    <span
                      className="
                        whitespace-nowrap
                        rounded-full
                        bg-white
                        px-3
                        py-1
                        text-xs
                        font-medium
                        text-slate-500
                        shadow-sm
                      "
                    >
                      {new Date(history.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      justify-between
                      border-t
                      border-slate-200
                      pt-4
                    "
                  >
                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        ${config.color}
                      `}
                    >
                      {history.status}
                    </span>

                    <span className="text-xs text-slate-500">
                      {new Date(history.createdAt).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Timeline;
