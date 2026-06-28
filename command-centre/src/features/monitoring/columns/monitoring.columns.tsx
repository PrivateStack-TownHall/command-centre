import { Server } from "lucide-react";

import type { ColumnDef } from "@tanstack/react-table";

import StatusBadge from "@/components/shared/StatusBadge";

import type { Service } from "../types/monitoring.type";

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: "name",

    header: "Application",

    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-blue-100
            text-blue-600
          "
        >
          <Server size={18} />
        </div>

        <div>
          <p className="font-semibold text-slate-900">{row.original.name}</p>

          <p className="text-xs text-slate-500">Production Environment</p>
        </div>
      </div>
    ),
  },

  {
    accessorKey: "uptime",

    header: "Uptime",

    cell: ({ row }) => (
      <div>
        <p className="font-semibold text-emerald-600">{row.original.uptime}</p>

        <p className="text-xs text-slate-500">Last 30 Days</p>
      </div>
    ),
  },

  {
    accessorKey: "responseTime",

    header: "Response",

    cell: ({ row }) => (
      <span
        className="
          rounded-full
          bg-blue-50
          px-3
          py-1
          text-xs
          font-medium
          text-blue-700
        "
      >
        {row.original.responseTime}
      </span>
    ),
  },

  {
    accessorKey: "status",

    header: "Status",

    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];
