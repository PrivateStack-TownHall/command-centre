import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import DetailPanel from "@/components/shared/detail-panel/DetailPanel";
import DetailPanelHeader from "@/components/shared/detail-panel/DetailPanelHeader";

import { badgeVariants } from "@/lib/badge-variants";

import {
  APPLICATION_CONFIG,
  type ApplicationId,
} from "@/features/applications/config/application.config";

interface BuildingInfoPanelProps {
  appId: string | null;
  onClose: () => void;
}

function BuildingInfoPanel({ appId, onClose }: BuildingInfoPanelProps) {
  const config = appId ? APPLICATION_CONFIG[appId as ApplicationId] : undefined;

  return (
    <DetailPanel isOpen={!!config}>
      {config && (
        <>
          <DetailPanelHeader
            title={config.app.name}
            subtitle={config.app.description}
            onClose={onClose}
          />

          <div className="space-y-4 p-4">
            <div className="text-4xl">{config.emoji}</div>

            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Available tabs
              </p>

              <div className="flex flex-wrap gap-1.5">
                {config.resources.map((resource) => (
                  <span
                    key={resource.key}
                    className={`rounded-md px-2 py-1 text-xs font-medium ${badgeVariants[config.color]}`}
                  >
                    {resource.label}
                  </span>
                ))}
              </div>
            </div>

            {!config.app.url && (
              <p className="rounded-md bg-amber-50 p-3 text-xs text-amber-700">
                Backend belum di-deploy — tab di atas akan tampil kosong
                sampai VITE_*_URL diisi di .env.
              </p>
            )}

            <Link
              to={config.app.path}
              className="
                inline-flex
                items-center
                gap-2
                rounded-md
                bg-blue-600
                px-4
                py-2
                text-sm
                font-medium
                text-white
                shadow-sm
                transition-colors
                hover:bg-blue-700
              "
            >
              Manage {config.entityPluralName}
              <ArrowRight size={16} />
            </Link>
          </div>
        </>
      )}
    </DetailPanel>
  );
}

export default BuildingInfoPanel;
