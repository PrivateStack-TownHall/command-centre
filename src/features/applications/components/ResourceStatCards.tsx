import {
  Boxes,
  FolderKanban,
  ImageIcon,
  Star,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  categories: FolderKanban,
  images: ImageIcon,
  reviews: Star,
};

interface ResourceStatCardsProps {
  resources: { key: string; label: string }[];
  getCount: (key: string) => number | undefined;
}

/**
 * Small KPI cards summarizing each resource's count — shown next to the
 * page title for apps that have a /stats endpoint to back it.
 */
function ResourceStatCards({ resources, getCount }: ResourceStatCardsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {resources.map((resource) => {
        const Icon = ICONS[resource.key] ?? Boxes;
        const count = getCount(resource.key);

        return (
          <div
            key={resource.key}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none text-slate-900">
                {count ?? "-"}
              </p>
              <p className="mt-1 text-xs text-slate-500">{resource.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ResourceStatCards;
