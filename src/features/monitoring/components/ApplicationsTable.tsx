import { Link } from "react-router-dom";
import { ArrowRight, Boxes } from "lucide-react";

import { PATHS } from "@/app/routes/paths";
import { APPLICATIONS } from "@/lib/constants";

interface KingsBrewHealth {
  status: string;
  uptimeSeconds: number;
  latencyMs: number;
}

interface Props {
  totalCount: number;
  kingsBrew?: KingsBrewHealth;
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${Math.floor(seconds % 60)}s`;
}

// Preview the first 5 apps, same as the design — Kings Brew is the only
// one with a real public /health endpoint, so it's the only row with
// live numbers; the rest are honestly marked "Not monitored".
const PREVIEW_APPS = APPLICATIONS.slice(0, 5);

export default function ApplicationsTable({ totalCount, kingsBrew }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Boxes className="h-5 w-5 text-blue-600" />
        <h2 className="font-semibold">Applications</h2>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
          {totalCount}
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
            {PREVIEW_APPS.map((app) => {
              const isKingsBrew = app.id === "kings-brew";
              const isUp = isKingsBrew && kingsBrew?.status === "UP";

              return (
                <tr key={app.id}>
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-lg">
                        {app.emoji}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{app.name}</p>
                        <p className="text-xs text-slate-400">
                          {isKingsBrew
                            ? "Production Environment"
                            : "Not monitored"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 pr-3 text-slate-600">
                    {isKingsBrew && kingsBrew
                      ? formatUptime(kingsBrew.uptimeSeconds)
                      : "-"}
                  </td>

                  <td className="py-3 pr-3">
                    {isKingsBrew && kingsBrew ? (
                      <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
                        {kingsBrew.latencyMs}ms
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>

                  <td className="py-3">
                    {isKingsBrew ? (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isUp
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${isUp ? "bg-emerald-500" : "bg-red-500"}`}
                        />
                        {isUp ? "Online" : "Offline"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        Unknown
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Link
        to={PATHS.APPLICATIONS}
        className="mt-4 flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        View all {totalCount} applications
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
