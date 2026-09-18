import { useState } from "react";
import { Layers } from "lucide-react";

import PageContainer from "@/components/shared/page/PageContainer";
import PageHeader from "@/components/shared/page/PageHeader";

import { APPLICATIONS } from "@/lib/constants";

import CityMap from "../components/CityMap";
import BuildingInfoPanel from "../components/BuildingInfoPanel";

function EcosystemMapPage() {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  return (
    <PageContainer>
      <div className="flex gap-6">
        <div className="min-w-0 flex-1 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <PageHeader
              title="Ecosystem Map"
              description="Click a building to see what's running inside."
            />

            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold leading-none text-slate-900">
                  {APPLICATIONS.length} Applications
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Across the ecosystem
                </p>
              </div>
            </div>
          </div>

          <CityMap onSelectApp={setSelectedAppId} />

          <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-900">
                Entrepreneur Topics Ecosystem
              </p>
              <p className="text-xs text-slate-500">
                ONE GROUP · ONE VISION · ENDLESS IMPACT.
              </p>
            </div>

            <p className="text-xs text-slate-500">
              Click any building to explore →
            </p>
          </div>
        </div>

        <BuildingInfoPanel
          appId={selectedAppId}
          onClose={() => setSelectedAppId(null)}
        />
      </div>
    </PageContainer>
  );
}

export default EcosystemMapPage;
