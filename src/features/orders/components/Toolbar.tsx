import { LayoutGrid, List, Search, SlidersHorizontal } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;

  application: string;
  onApplicationChange: (value: string) => void;

  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;

  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

function Toolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  application,
  onApplicationChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  view,
  onViewChange,
}: ToolbarProps) {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        rounded-xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >
      <div className="relative w-full lg:max-w-md">
        <Search
          className="
            absolute
            left-3
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-slate-400
          "
        />

        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search order number or customer..."
          className="
            h-11
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            pl-10
            pr-4
            text-sm
            outline-none
            transition
            focus:border-primary
            focus:ring-4
            focus:ring-primary/10
          "
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="h-11 w-48 rounded-xl border-slate-200">
            <SlidersHorizontal className="mr-2 h-4 w-4" />

            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>

            <SelectItem value="PENDING">Pending</SelectItem>

            <SelectItem value="PAID">Paid</SelectItem>

            <SelectItem value="PROCESSING">Processing</SelectItem>

            <SelectItem value="COMPLETED">Completed</SelectItem>

            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={application} onValueChange={onApplicationChange}>
          <SelectTrigger className="h-11 w-56 rounded-xl border-slate-200">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="kings-brew">☕ Kings Brew</SelectItem>
            <SelectItem value="castle-kitchen">🥩 Castle Kitchen</SelectItem>
            <SelectItem value="byte-burger">🍔 Byte Burger</SelectItem>
            <SelectItem value="quantum-mart">🛒 Quantum Mart</SelectItem>
            <SelectItem value="trade-hub">🏪 Trade Hub</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="w-[130px] bg-transparent text-sm outline-none"
          />
          <span className="text-slate-300">–</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="w-[130px] bg-transparent text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-slate-200 p-1">
          <button
            onClick={() => onViewChange("grid")}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              view === "grid"
                ? "bg-primary text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>

          <button
            onClick={() => onViewChange("list")}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              view === "list"
                ? "bg-primary text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
