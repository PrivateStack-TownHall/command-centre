import type { ColumnDef } from "@tanstack/react-table";

import {
  ShoppingCart,
  CreditCard,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { Order } from "../types/order.type";

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",

    header: "#",

    cell: ({ row }) => (
      <span className="font-semibold text-slate-500">#{row.original.id}</span>
    ),
  },

  {
    id: "order",

    header: "Order",

    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex items-start gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-blue-100
              text-blue-600
            "
          >
            <ShoppingCart className="h-6 w-6" />
          </div>

          <div className="space-y-2">
            <div>
              <p className="font-semibold">{order.orderNumber}</p>

              <p className="text-xs text-slate-500">
                {new Date(order.createdAt).toLocaleDateString("id-ID")}
              </p>
            </div>

            <div className="space-y-1">
              {order.items?.slice(0, 3).map((item) => (
                <div key={item.id} className="text-sm text-slate-600">
                  • {item.productName}
                  <span className="ml-1 text-slate-400">× {item.quantity}</span>
                </div>
              ))}

              {order.items?.length > 3 && (
                <p className="text-xs text-slate-500">
                  +{order.items.length - 3} more items
                </p>
              )}
            </div>
          </div>
        </div>
      );
    },
  },

  {
    id: "payment",

    header: "Payment",

    cell: ({ row }) => {
      const payment = row.original.payments?.[0];

      if (!payment) {
        return <Badge variant="outline">No Payment</Badge>;
      }

      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-slate-500" />

            <span className="font-medium">
              {payment.method.replaceAll("_", " ")}
            </span>
          </div>

          <p className="text-xs text-slate-500">{payment.status}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "totalAmount",

    header: "Total",

    cell: ({ row }) => (
      <div>
        <p className="text-lg font-bold text-emerald-600">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(row.original.totalAmount)}
        </p>

        <p className="text-xs text-slate-500">
          {row.original.items?.length ?? 0} items
        </p>
      </div>
    ),
  },

  {
    accessorKey: "status",

    header: "Status",

    cell: ({ row }) => {
      const status = row.original.status;

      if (status === "PAID") {
        return (
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />

            <span className="font-medium">Paid</span>
          </div>
        );
      }

      if (status === "PENDING") {
        return (
          <div className="flex items-center gap-2 text-amber-600">
            <Clock3 className="h-4 w-4" />

            <span className="font-medium">Pending</span>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-2 text-red-600">
          <XCircle className="h-4 w-4" />

          <span className="font-medium">{status}</span>
        </div>
      );
    },
  },
];
