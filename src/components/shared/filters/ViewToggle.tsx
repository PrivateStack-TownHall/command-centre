import { LayoutGrid, List } from "lucide-react";

import { cn } from "@/lib/utils";

export type FeedView = "grid" | "list";

interface ViewToggleProps {
  view: FeedView;
  onViewChange: (view: FeedView) => void;
}

const OPTIONS = [
  { value: "grid", label: "Grid", icon: LayoutGrid },
  { value: "list", label: "List", icon: List },
] as const;

function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Layout">
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          aria-pressed={view === value}
          onClick={() => onViewChange(value)}
          className={cn(
            "flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-blue-500/30",
            view === value
              ? "bg-slate-900 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
          )}
        >
          <Icon aria-hidden className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
}

export default ViewToggle;
