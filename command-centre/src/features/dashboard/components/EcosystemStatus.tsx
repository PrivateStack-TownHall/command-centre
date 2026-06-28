import { CheckCircle2, ServerCrash, TriangleAlert } from "lucide-react";

import type { CommandCentreApplication } from "../types/command-centre.type";

interface EcosystemStatusProps {
  applications: CommandCentreApplication[];
}

function EcosystemStatus({ applications }: EcosystemStatusProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="font-semibold">Ecosystem Status</h2>

        <p className="text-sm text-slate-500">
          Live infrastructure health across all applications.
        </p>
      </div>

      <div className="space-y-3">
        {applications.map((app) => {
          const connected =
            app.health.status === "UP" &&
            app.monitoring.database.status === "CONNECTED";

          const latency = app.monitoring.database.latency;

          const status = !connected
            ? "offline"
            : latency > 1000
              ? "warning"
              : "online";

          return (
            <div
              key={app.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{app.emoji}</div>

                <div>
                  <p className="font-medium">{app.name}</p>

                  <p className="text-xs text-slate-500">{latency} ms</p>
                </div>
              </div>

              {status === "online" && (
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Online</span>
                </div>
              )}

              {status === "warning" && (
                <div className="flex items-center gap-2 text-amber-600">
                  <TriangleAlert className="h-5 w-5" />
                  <span className="font-medium">Warning</span>
                </div>
              )}

              {status === "offline" && (
                <div className="flex items-center gap-2 text-red-600">
                  <ServerCrash className="h-5 w-5" />
                  <span className="font-medium">Offline</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EcosystemStatus;
