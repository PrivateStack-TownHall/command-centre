import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Radix Select doesn't allow an empty-string item value, so every
 * "All ..." option uses this sentinel instead.
 */
export const ALL_OPTION = "ALL";

export interface FilterSelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  /** Muted text after the label, e.g. "Coming soon". */
  hint?: string;
}

interface FilterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: FilterSelectOption[];
  /** Accessible name, e.g. "Filter by application". */
  label: string;
  icon?: LucideIcon;
  className?: string;
}

function FilterSelect({
  value,
  onValueChange,
  options,
  label,
  icon: Icon,
  className,
}: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        aria-label={label}
        className={cn(
          "h-11 w-[180px] rounded-xl border-slate-200 bg-white text-slate-700 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/30 data-[size=default]:h-11",
          className,
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {Icon && <Icon aria-hidden className="h-4 w-4 text-slate-400" />}
          <SelectValue />
        </span>
      </SelectTrigger>

      {/* This project's theme doesn't define shadcn's popover/accent tokens,
          so the menu's surface and highlight colours are set explicitly. */}
      <SelectContent
        position="popper"
        align="start"
        sideOffset={4}
        className="rounded-xl border-slate-200 bg-white text-slate-700 shadow-lg"
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="rounded-lg focus:bg-slate-100 focus:text-slate-900"
          >
            {option.label}
            {option.hint && (
              <span className="text-xs text-slate-400">{option.hint}</span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default FilterSelect;
