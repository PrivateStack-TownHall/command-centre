import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Terminal,
  Zap,
} from "lucide-react";

interface Props {
  logs: any[];
  isLoading?: boolean;
}

export default function AuditLogsCard({ logs, isLoading }: Props) {
  return (
    <div className="rounded-md border border-gray-300 bg-white">
      <div className="px-5 py-4">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-violet-600" />

          <h3 className="font-semibold">Audit Logs</h3>
        </div>

        <p className="mt-1 text-xs text-slate-500">
          Latest platform activities
        </p>
      </div>

      <div className="max-h-[650px] overflow-y-auto bg-gray-100 p-2">
        {isLoading && (
          <div className="p-4 text-sm text-slate-500">
            Loading audit logs...
          </div>
        )}

        {!isLoading &&
          logs.map((log: any) => (
            <div key={log.id} className="mb-3 rounded-md bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{log.action}</p>

                  <p className="text-xs text-slate-500">{log.entity}</p>
                </div>

                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{log.user?.fullName ?? "System"}</span>

                <span className="flex items-center gap-1">
                  <Clock3 size={12} />

                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
