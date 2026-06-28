import { CheckCircle2, Clock3 } from "lucide-react";

import type { CommandCentreApplication } from "../types/command-centre.type";

interface LastSynchronizationProps {
  applications: CommandCentreApplication[];
}

function LastSynchronization({ applications }: LastSynchronizationProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Clock3 className="h-5 w-5 text-primary" />

        <div>
          <h2 className="font-semibold">Last Synchronization</h2>

          <p className="text-sm text-slate-500">
            Latest synchronization status for every application.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {applications.map((app) => (
          <div
            key={app.id}
            className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{app.emoji}</div>

              <div>
                <p className="font-medium">{app.name}</p>

                <p className="text-xs text-slate-500">
                  {new Date(
                    app.monitoring.response.generatedAt,
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Synced</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LastSynchronization;
