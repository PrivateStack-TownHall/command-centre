import {
  Cloud,
  Database as DatabaseIcon,
  Layers,
  Workflow,
} from "lucide-react";

interface Props {
  databaseStatus?: string;
}

type Status = "online" | "warning" | "offline" | "unknown";

function StatusPill({ status }: { status: Status }) {
  const style: Record<Status, string> = {
    online: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    offline: "bg-red-100 text-red-700",
    unknown: "bg-slate-100 text-slate-500",
  };

  const dot: Record<Status, string> = {
    online: "bg-emerald-500",
    warning: "bg-amber-500",
    offline: "bg-red-500",
    unknown: "bg-slate-400",
  };

  const label: Record<Status, string> = {
    online: "Online",
    warning: "Warning",
    offline: "Offline",
    unknown: "Unknown",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot[status]}`} />
      {label[status]}
    </span>
  );
}

export default function InfrastructureCard({ databaseStatus }: Props) {
  // Only "PostgreSQL" maps to something we can actually verify (Kings
  // Brew's /monitoring reports its own database connection). The other
  // three have no corresponding endpoint anywhere in the ecosystem, so
  // they're honestly marked Unknown rather than a fabricated status.
  const dbStatus: Status =
    databaseStatus === "CONNECTED"
      ? "online"
      : databaseStatus
        ? "offline"
        : "unknown";

  const rows: { label: string; icon: typeof Workflow; status: Status }[] = [
    { label: "API Gateway", icon: Workflow, status: "unknown" },
    { label: "PostgreSQL", icon: DatabaseIcon, status: dbStatus },
    { label: "Redis Cache", icon: Layers, status: "unknown" },
    { label: "Object Storage", icon: Cloud, status: "unknown" },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <DatabaseIcon className="h-5 w-5 text-blue-600" />
        <h2 className="font-semibold">Infrastructure</h2>
      </div>

      <div className="space-y-1">
        {rows.map((row) => {
          const Icon = row.icon;

          return (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-lg px-2 py-2.5 transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm text-slate-700">{row.label}</span>
              </div>

              <StatusPill status={row.status} />
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Only PostgreSQL reflects real data (via Kings Brew's /monitoring
        endpoint) — the rest have no API to check yet.
      </p>
    </div>
  );
}
