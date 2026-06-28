import { Search, SlidersHorizontal } from "lucide-react";

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
}

function Toolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  application,
  onApplicationChange,
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

      <div className="flex flex-wrap gap-3">
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
            <SelectItem value="ALL">All Applications</SelectItem>

            <SelectItem value="COFFEE">☕ Kings Brew</SelectItem>

            <SelectItem value="RESTAURANT">🥩 Castle Kitchen</SelectItem>

            <SelectItem value="BURGER">🍔 Byte Burger</SelectItem>

            <SelectItem value="MART">🛒 Quantum Mart</SelectItem>

            <SelectItem value="ECOMMERCE">🏪 Trade Hub</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default Toolbar;
