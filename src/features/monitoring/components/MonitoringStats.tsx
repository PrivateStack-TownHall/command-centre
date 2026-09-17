import { AlertTriangle, CheckCircle2, Server, Zap } from "lucide-react";

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
    <div className="grid grid-cols-2 gap-4 xl:flex xl:items-center">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Server className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xl font-bold leading-none text-slate-900">
            {total}
          </p>
          <p className="mt-1 text-xs text-slate-500">Total Services</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xl font-bold leading-none text-slate-900">
            {online}
          </p>
          <p className="mt-1 text-xs text-slate-500">Online</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xl font-bold leading-none text-slate-900">
            {warning}
          </p>
          <p className="mt-1 text-xs text-slate-500">Waking up</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <Zap className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xl font-bold leading-none text-slate-900">
            {offline}
          </p>
          <p className="mt-1 text-xs text-slate-500">Offline</p>
        </div>
      </div>
    </div>
  );
}
