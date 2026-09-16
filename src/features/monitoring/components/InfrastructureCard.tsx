interface Props {
  databaseStatus: string;
  latencyMs: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
}

function formatBytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function InfrastructureCard({
  databaseStatus,
  latencyMs,
  memory,
}: Props) {
  const heapPct = memory.heapTotal
    ? Math.round((memory.heapUsed / memory.heapTotal) * 100)
    : 0;

  return (
    <div className="rounded-md border border-gray-300 bg-white p-5">
      <h3 className="font-semibold">System Resources</h3>
      <p className="mt-1 text-xs text-slate-500">
        Live process metrics from Kings Brew's /monitoring endpoint.
      </p>

      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Database</span>
          <span
            className={`text-sm font-medium ${
              databaseStatus === "CONNECTED"
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            {databaseStatus}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Database Latency</span>
          <span className="text-sm font-medium">{latencyMs} ms</span>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Heap Memory</span>
            <span className="font-medium">
              {formatBytes(memory.heapUsed)} / {formatBytes(memory.heapTotal)}
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-violet-500"
              style={{ width: `${heapPct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">RSS Memory</span>
          <span className="text-sm font-medium">{formatBytes(memory.rss)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">External Memory</span>
          <span className="text-sm font-medium">
            {formatBytes(memory.external)}
          </span>
        </div>
      </div>
    </div>
  );
}
