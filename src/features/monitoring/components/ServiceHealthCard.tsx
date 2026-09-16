interface Props {
  appName: string;
  emoji: string;
  status: string;
  version: string;
  uptimeSeconds: number;
  environment: string;
  platform: string;
  nodeVersion: string;
}

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${Math.floor(seconds % 60)}s`;
}

export default function ServiceHealthCard({
  appName,
  emoji,
  status,
  version,
  uptimeSeconds,
  environment,
  platform,
  nodeVersion,
}: Props) {
  const isUp = status === "UP";

  return (
    <div className="rounded-md border border-gray-300 bg-white p-5">
      <h3 className="mb-4 font-semibold">Application Health</h3>

      <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl">
            {emoji}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{appName}</p>
            <p className="text-xs text-slate-500">
              v{version} · {environment} · {platform} · node {nodeVersion}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            isUp
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isUp ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          {isUp ? "Online" : "Offline"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Uptime</p>
          <p className="mt-1 font-semibold">{formatUptime(uptimeSeconds)}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Version</p>
          <p className="mt-1 font-semibold">{version}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Other applications aren't shown here — only Kings Brew exposes a
        public /health endpoint today.
      </p>
    </div>
  );
}
