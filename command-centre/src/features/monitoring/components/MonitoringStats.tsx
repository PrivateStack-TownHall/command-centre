import { Activity, AlertTriangle, CheckCircle2, Zap } from "lucide-react";

interface Props {
  total: number;
  online: number;
  warning: number;
  offline: number;
}

export default function MonitoringStats({
  total,
  online,
  warning,
  offline,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-md border-2 border-blue-500 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Total Services</p>

            <h2 className="mt-1 text-3xl font-bold">{total}</h2>
          </div>

          <Activity className="text-blue-500" />
        </div>
      </div>

      <div className="rounded-md border-2 border-emerald-600 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Online</p>

            <h2 className="mt-1 text-3xl font-bold text-emerald-600">
              {online}
            </h2>
          </div>

          <CheckCircle2 className="text-emerald-500" />
        </div>
      </div>

      <div className="rounded-md border-2 border-amber-600 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Warning</p>

            <h2 className="mt-1 text-3xl font-bold text-amber-600">
              {warning}
            </h2>
          </div>

          <AlertTriangle className="text-amber-500" />
        </div>
      </div>

      <div className="rounded-md border-2 border-red-600 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Offline</p>

            <h2 className="mt-1 text-3xl font-bold text-red-600">{offline}</h2>
          </div>

          <Zap className="text-red-500" />
        </div>
      </div>
    </div>
  );
}
