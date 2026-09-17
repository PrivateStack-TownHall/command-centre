import { Link } from "react-router-dom";
import { ArrowRight, Boxes } from "lucide-react";

import { PATHS } from "@/app/routes/paths";

import type { HealthRow, HealthState } from "../utils/health-rows";

interface Props {
  rows: HealthRow[];
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${Math.floor(seconds % 60)}s`;
}

const STATUS: Record<HealthState, { label: string; pill: string; dot: string }> = {
  online: { label: "Online", pill: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  waking: { label: "Waking up", pill: "bg-amber-100 text-amber-700", dot: "bg-amber-500 animate-pulse" },
  offline: { label: "Offline", pill: "bg-red-100 text-red-700", dot: "bg-red-500" },
  "not-deployed": { label: "Not deployed", pill: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
};

export default function ApplicationsTable({ rows }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Boxes className="h-5 w-5 text-blue-600" />
        <h2 className="font-semibold">Applications</h2>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
          {rows.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="pb-2 pr-3">Application</th>
              <th className="pb-2 pr-3">Uptime</th>
              <th className="pb-2 pr-3">Response</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((row) => {
              const status = STATUS[row.state];

              return (
                <tr key={row.id}>
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-lg">
                        {row.emoji}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{row.name}</p>
                        <p className="text-xs text-slate-400">
                          {row.state === "not-deployed"
                            ? "No backend yet"
                            : "Production Environment"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 pr-3 text-slate-600">
                    {row.uptimeSeconds !== undefined
                      ? formatUptime(row.uptimeSeconds)
                      : "-"}
                  </td>

                  <td className="py-3 pr-3">
                    {row.latencyMs !== undefined ? (
                      <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
                        {row.latencyMs}ms
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>

                  <td className="py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.pill}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Link
        to={PATHS.APPLICATIONS}
        className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
      >
        View all {rows.length} applications
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
