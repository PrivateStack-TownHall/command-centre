import FilterBar from "@/components/shared/filters/FilterBar";
import FilterSelect, {
  ALL_OPTION,
} from "@/components/shared/filters/FilterSelect";
import SearchField from "@/components/shared/filters/SearchField";
import ViewToggle, {
  type FeedView,
} from "@/components/shared/filters/ViewToggle";

import ApplicationSelect from "@/features/applications/components/ApplicationSelect";

import { REVIEW_APPLICATIONS } from "../config/review.config";

interface ReviewFilterProps {
  search: string;
  application: string;
  rating: string;
  sort: string;
  view: FeedView;

  onSearchChange: (value: string) => void;
  onApplicationChange: (value: string) => void;
  onRatingChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onViewChange: (view: FeedView) => void;
}

// Filters by average rating rounded down, so "4 & up" keeps a product
// averaging 4.6 but not one averaging 3.9.
const RATING_OPTIONS = [
  { value: ALL_OPTION, label: "All Ratings" },
  { value: "5", label: "⭐⭐⭐⭐⭐ 5 Stars" },
  { value: "4", label: "⭐⭐⭐⭐ 4 & up" },
  { value: "3", label: "⭐⭐⭐ 3 & up" },
  { value: "2", label: "⭐⭐ 2 & up" },
  { value: "1", label: "⭐ 1 & up" },
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest Reviews" },
  { value: "oldest", label: "Oldest Reviews" },
  { value: "highest", label: "Highest Rating" },
  { value: "lowest", label: "Lowest Rating" },
];

function ReviewFilter({
  search,
  application,
  rating,
  sort,
  view,
  onSearchChange,
  onApplicationChange,
  onRatingChange,
  onSortChange,
  onViewChange,
}: ReviewFilterProps) {
  return (
    <FilterBar>
      <SearchField
        value={search}
        onChange={onSearchChange}
        placeholder="Search reviews or products..."
      />

      <ApplicationSelect
        applications={REVIEW_APPLICATIONS}
        value={application}
        onValueChange={onApplicationChange}
      />

      <FilterSelect
        label="Filter by rating"
        value={rating}
        onValueChange={onRatingChange}
        options={RATING_OPTIONS}
      />

      <FilterSelect
        label="Sort reviews"
        value={sort}
        onValueChange={onSortChange}
        options={SORT_OPTIONS}
      />

      <ViewToggle view={view} onViewChange={onViewChange} />
    </FilterBar>
  );
}

export default ReviewFilter;
