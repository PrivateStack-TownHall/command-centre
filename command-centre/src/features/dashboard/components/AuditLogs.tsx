import { FileText } from "lucide-react";

import type { CommandCentreApplication } from "../types/command-centre.type";

interface AuditLogsProps {
  applications: CommandCentreApplication[];
}

function AuditLogs({ applications }: AuditLogsProps) {
  const logs = applications
    .flatMap((app) =>
      app.activities.map((activity) => ({
        ...activity,
        emoji: app.emoji,
      })),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />

        <div>
          <h2 className="font-semibold">Audit Logs</h2>

          <p className="text-sm text-slate-500">
            Latest system activities from all applications.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start justify-between rounded-xl border border-slate-100 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{log.emoji}</div>

              <div>
                <h3 className="font-medium">{log.type}</h3>

                <p className="text-sm text-slate-500">{log.application}</p>

                <p className="mt-1 text-sm text-slate-700">{log.description}</p>
              </div>
            </div>

            <span className="text-xs text-slate-400">
              {new Date(log.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuditLogs;
