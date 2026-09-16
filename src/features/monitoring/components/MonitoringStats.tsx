import { Activity, Clock3, Database, Gauge } from "lucide-react";

interface Props {
  status: string;
  databaseStatus: string;
  uptimeSeconds: number;
  latencyMs: number;
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${Math.floor(seconds % 60)}s`;
}

export default function MonitoringStats({
  status,
  databaseStatus,
  uptimeSeconds,
  latencyMs,
}: Props) {
  const isUp = status === "UP";
  const isConnected = databaseStatus === "CONNECTED";

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div
        className={`rounded-md border-2 bg-white p-5 ${
          isUp ? "border-emerald-500" : "border-red-500"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Application Status</p>
            <h2
              className={`mt-1 text-2xl font-bold ${
                isUp ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {status}
            </h2>
          </div>
          <Activity className={isUp ? "text-emerald-500" : "text-red-500"} />
        </div>
      </div>

      <div
        className={`rounded-md border-2 bg-white p-5 ${
          isConnected ? "border-blue-500" : "border-red-500"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Database</p>
            <h2
              className={`mt-1 text-2xl font-bold ${
                isConnected ? "text-blue-600" : "text-red-600"
              }`}
            >
              {databaseStatus}
            </h2>
          </div>
          <Database className="text-blue-500" />
        </div>
      </div>

      <div className="rounded-md border-2 border-violet-500 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Uptime</p>
            <h2 className="mt-1 text-2xl font-bold text-violet-600">
              {formatUptime(uptimeSeconds)}
            </h2>
          </div>
          <Clock3 className="text-violet-500" />
        </div>
      </div>

      <div className="rounded-md border-2 border-amber-500 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">DB Latency</p>
            <h2 className="mt-1 text-2xl font-bold text-amber-600">
              {latencyMs} ms
            </h2>
          </div>
          <Gauge className="text-amber-500" />
        </div>
      </div>
    </div>
  );
}
