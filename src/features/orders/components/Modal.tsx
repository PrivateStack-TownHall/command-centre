import { BadgeCheck, Clock3, Package, ShoppingBag } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CustomerCard from "./modal/CustomerCard";
import OrderItemsCard from "./modal/OrderItemsCard";
import PaymentCard from "./modal/PaymentCard";
import SummaryCard from "./modal/SummaryCard";
import Timeline from "./modal/Timeline";

import type { Order } from "../types/order.type";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

function Modal({ open, onOpenChange, order }: ModalProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          h-[92vh]
          w-[96vw]
          max-w-[1200px]
          overflow-hidden
          rounded-xl
          border
          p-0
          shadow-2xl
        "
      >
        <div className="flex h-full flex-col bg-white">
          <div
            className={`
              border-b
              border-slate-200
              bg-gradient-to-r
              ${statusConfig.gradient}
              px-8
              py-6
            `}
          >
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                      shadow-sm
                    "
                  >
                    <ShoppingBag className="h-7 w-7 text-primary" />
                  </div>

                  <div>
                    <DialogTitle className="text-3xl font-bold text-slate-900">
                      {order.orderNumber}
                    </DialogTitle>

                    <p className="mt-1 text-sm text-slate-500">
                      Customer Order Details
                    </p>
                  </div>
                </div>

                <div
                  className={`
                    flex
                    items-center
                    gap-2
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    ${statusConfig.badge}
                  `}
                >
                  <StatusIcon className="h-4 w-4" />

                  <span>{order.status}</span>
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <aside
              className="
                w-[380px]
                shrink-0
                overflow-y-auto
                border-r
                border-slate-200
                bg-slate-50/70
                p-6
              "
            >
              <div className="space-y-6">
                <CustomerCard order={order} />

                <PaymentCard order={order} />

                <SummaryCard order={order} />
              </div>
            </aside>

            <main
              className="
                flex-1
                overflow-y-auto
                bg-white
                p-8
              "
            >
              <div className="space-y-6">
                <OrderItemsCard order={order} />

                <Timeline histories={order.histories} />
              </div>
            </main>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
