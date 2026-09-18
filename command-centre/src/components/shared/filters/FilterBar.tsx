import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FilterBarProps {
  children: ReactNode;
  className?: string;
}

/**
 * Shared frame for every page's filter row (Applications, Reviews, Orders)
 * so search boxes, dropdowns and toggles line up the same way everywhere.
 */
function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default FilterBar;
