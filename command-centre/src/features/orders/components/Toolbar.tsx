import { SlidersHorizontal } from "lucide-react";

import FilterBar from "@/components/shared/filters/FilterBar";
import FilterSelect, {
  ALL_OPTION,
} from "@/components/shared/filters/FilterSelect";
import SearchField from "@/components/shared/filters/SearchField";
import ViewToggle, {
  type FeedView,
} from "@/components/shared/filters/ViewToggle";

import ApplicationSelect from "@/features/applications/components/ApplicationSelect";

import { ORDER_APPLICATIONS } from "../config/order.config";

interface ToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;

  application: string;
  onApplicationChange: (value: string) => void;

  sort: string;
  onSortChange: (value: string) => void;

  view: FeedView;
  onViewChange: (view: FeedView) => void;
}

const STATUS_OPTIONS = [
  { value: ALL_OPTION, label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest Orders" },
  { value: "oldest", label: "Oldest Orders" },
  { value: "highest", label: "Highest Amount" },
  { value: "lowest", label: "Lowest Amount" },
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
  view,
  onViewChange,
}: ToolbarProps) {
  return (
    <FilterBar>
      <SearchField
        value={search}
        onChange={onSearchChange}
        placeholder="Search orders or customers..."
      />

      <ApplicationSelect
        applications={ORDER_APPLICATIONS}
        value={application}
        onValueChange={onApplicationChange}
      />

      <FilterSelect
        label="Filter by status"
        value={status}
        onValueChange={onStatusChange}
        options={STATUS_OPTIONS}
        icon={SlidersHorizontal}
      />

      <FilterSelect
        label="Sort orders"
        value={sort}
        onValueChange={onSortChange}
        options={SORT_OPTIONS}
      />

      <ViewToggle view={view} onViewChange={onViewChange} />
    </FilterBar>
  );
}

export default Toolbar;
