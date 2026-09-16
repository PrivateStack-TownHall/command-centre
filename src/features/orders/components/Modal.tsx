import {
  BadgeCheck,
  Clock3,
  CreditCard,
  FileText,
  LoaderCircle,
  MapPin,
  ShoppingCart,
  X,
  XCircle,
} from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import type { Order } from "../types/order.type";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
}

interface StatusVisual {
  badge: string;
  card: string;
  icon: typeof BadgeCheck;
  label: string;
}

interface StatusConfigMap {
  PENDING: StatusVisual;
  PAID: StatusVisual;
  PROCESSING: StatusVisual;
  COMPLETED: StatusVisual;
  CANCELLED: StatusVisual;
}

const STATUS_CONFIG: StatusConfigMap = {
  PENDING: {
    badge: "bg-amber-100 text-amber-700",
    card: "border-amber-200 bg-amber-50 text-amber-700",
    icon: Clock3,
    label: "Pending",
  },
  PAID: {
    badge: "bg-emerald-100 text-emerald-700",
    card: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: BadgeCheck,
    label: "Paid",
  },
  PROCESSING: {
    badge: "bg-blue-100 text-blue-700",
    card: "border-blue-200 bg-blue-50 text-blue-700",
    icon: LoaderCircle,
    label: "Processing",
  },
  COMPLETED: {
    badge: "bg-emerald-100 text-emerald-700",
    card: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: BadgeCheck,
    label: "Completed",
  },
  CANCELLED: {
    badge: "bg-red-100 text-red-700",
    card: "border-red-200 bg-red-50 text-red-700",
    icon: XCircle,
    label: "Cancelled",
  },
};

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDateTime(value: string): string {
  return `${new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })} at ${new Date(value).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function Modal({ open, onOpenChange, order }: ModalProps) {
  const status = STATUS_CONFIG[order.status as keyof StatusConfigMap];
  const StatusIcon = status.icon;

  const payment = order.payments[0];

  const latestHistory =
    [...order.histories].reverse().find((h) => h.status === order.status) ??
    null;

  const subtotal = order.items.reduce(
    (sum, item) => sum + Number(item.subtotal),
    0,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="
          max-h-[90vh]
          w-[95vw]
          max-w-4xl
          overflow-hidden
          rounded-2xl
          border-0
          p-0
        "
      >
        <div className="flex max-h-[90vh] flex-col bg-white">
          {/* header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Order Details
                </h2>
                <p className="text-xs text-slate-500">
                  Complete information about this order.
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenChange(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* body */}
          <div className="grid flex-1 grid-cols-1 gap-8 overflow-y-auto p-6 md:grid-cols-2">
            {/* left column */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-slate-900">
                    Order #{order.orderNumber}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.badge}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {status.label}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Placed on {formatDateTime(order.createdAt)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-900">
                  Customer Information
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {initialsOf(order.user.fullName)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {order.user.fullName}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {order.user.email}
                    </p>
                    <p className="text-sm text-slate-400">-</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-900">
                  Delivery Information
                </p>
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <p className="text-sm text-slate-400">
                    No delivery information available for this order.
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-900">
                  Payment Information
                </p>
                <div className="space-y-2 rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 shrink-0 text-slate-400" />
                    <p className="text-sm text-slate-700">
                      {payment
                        ? payment.method.replaceAll("_", " ")
                        : "No payment recorded"}
                    </p>
                  </div>

                  {payment && (
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
                  )}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-900">
                  Order Notes
                </p>
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <p className="text-sm text-slate-400">
                    No notes for this order.
                  </p>
                </div>
              </div>
            </div>

            {/* right column */}
            <div className="space-y-6">
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-900">
                  Order Status
                </p>

                <div className={`rounded-xl border p-4 ${status.card}`}>
                  <div className="flex items-center gap-2">
                    <StatusIcon className="h-5 w-5" />
                    <p className="font-bold">{status.label}</p>
                  </div>
                  <p className="mt-1 text-sm opacity-80">
                    {latestHistory
                      ? `Order ${status.label.toLowerCase()} on ${formatDateTime(latestHistory.createdAt)}`
                      : `Current status: ${status.label}`}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-slate-900">
                  Order Items
                </p>

                <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3">
                      <img
                        src="https://placehold.co/56x56"
                        alt={item.productName}
                        className="h-12 w-12 shrink-0 rounded-lg border border-slate-100 object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {item.productName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.quantity} × Rp{" "}
                          {Number(item.price).toLocaleString("id-ID")}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-semibold text-slate-900">
                        Rp {Number(item.subtotal).toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-4 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Shipping Fee</span>
                  <span>Rp 0</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Tax (0%)</span>
                  <span>Rp 0</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-base font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-emerald-600">
                    Rp {Number(order.totalAmount).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex border-t border-slate-100 p-4">
            <button
              onClick={() => onOpenChange(false)}
              className="ml-auto flex h-10 items-center justify-center rounded-lg bg-slate-100 px-6 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
