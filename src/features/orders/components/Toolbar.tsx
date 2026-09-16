import { LayoutGrid, List, Search, SlidersHorizontal } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import DateRangePicker from "./DateRangePicker";

interface ToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;

  application: string;
  onApplicationChange: (value: string) => void;

  sort: string;
  onSortChange: (value: string) => void;

  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;

  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

const APPS = [
  { value: "kings-brew", label: "Kings Brew", color: "#8B5E3C" },
  { value: "castle-kitchen", label: "Castle Kitchen", color: "#7F1D1D" },
  { value: "byte-burger", label: "Byte Burger", color: "#DC2626" },
  { value: "quantum-mart", label: "Quantum Mart", color: "#2563EB" },
  { value: "trade-hub", label: "Trade Hub", color: "#22C55E" },
];

function Toolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  application,
  onApplicationChange,
  sort,
  onSortChange,
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
        flex-wrap
        items-center
        gap-3
        rounded-xl
        border
        border-slate-200
        bg-white
        p-3
        shadow-sm
      "
    >
      <div className="relative min-w-[200px] flex-1">
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

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="h-11 w-36 rounded-xl border-slate-200">
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
        <SelectTrigger className="h-11 w-40 rounded-xl border-slate-200">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {APPS.map((app) => (
            <SelectItem key={app.value} value={app.value}>
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: app.color }}
                />
                {app.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="h-11 w-36 rounded-xl border-slate-200">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="latest">Latest Orders</SelectItem>
          <SelectItem value="oldest">Oldest Orders</SelectItem>
          <SelectItem value="highest">Highest Amount</SelectItem>
          <SelectItem value="lowest">Lowest Amount</SelectItem>
        </SelectContent>
      </Select>

      <DateRangePicker
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={onDateFromChange}
        onDateToChange={onDateToChange}
      />

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onViewChange("grid")}
          className={`flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors ${
            view === "grid"
              ? "bg-slate-900 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          Grid
        </button>

        <button
          onClick={() => onViewChange("list")}
          className={`flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors ${
            view === "list"
              ? "bg-slate-900 text-white"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <List className="h-4 w-4" />
          List
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
