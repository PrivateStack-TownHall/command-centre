import StatusBadge from "@/components/shared/StatusBadge";

export default function InfrastructureCard() {
  return (
    <div className="rounded-md border border-gray-300 bg-white p-5">
      <h3 className="font-semibold">Infrastructure</h3>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">API Gateway</span>

          <StatusBadge status="online" />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">PostgreSQL</span>

          <StatusBadge status="online" />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Redis Cache</span>

          <StatusBadge status="online" />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Object Storage</span>

          <StatusBadge status="warning" />
        </div>
      </div>
    </div>
  );
}
