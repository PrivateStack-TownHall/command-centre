import { memo, useEffect, useState } from "react";

import FilterBar from "@/components/shared/filters/FilterBar";
import FilterSelect, {
  ALL_OPTION,
} from "@/components/shared/filters/FilterSelect";
import SearchField from "@/components/shared/filters/SearchField";

interface ApplicationFiltersProps {
  search: string;
  /** Empty string means "all". */
  categoryId: string;
  sort: string;
  order: string;
  entityPluralName?: string;
  /** Show the category dropdown — only for resources whose endpoint
   *  accepts a category-style param (see `params.category` in config). */
  showCategory?: boolean;
  /** Show sort & order — only for resources with server-side sorting. */
  showSort?: boolean;
  /** Category options for the dropdown — { id, name } pulled from the
   *  app's own Categories resource, so people pick a name instead of
   *  having to know/guess a raw numeric id. */
  categories?: { id: number | string; name: string }[];
  /** Plural name of the option list, e.g. "Categories" or "Genres". */
  categoryLabel?: string;

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onOrderChange: (value: string) => void;
}

const SORT_OPTIONS = [
  { value: "createdAt", label: "Created At" },
  { value: "name", label: "Name" },
  { value: "price", label: "Price" },
  { value: "stock", label: "Stock" },
];

const ORDER_OPTIONS = [
  { value: "desc", label: "Descending" },
  { value: "asc", label: "Ascending" },
];

function ApplicationFilters({
  search,
  categoryId,
  sort,
  order,
  entityPluralName = "items",
  showCategory = false,
  showSort = false,
  categories = [],
  categoryLabel = "Categories",
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onOrderChange,
}: ApplicationFiltersProps) {
  // Debounce the search box locally so we don't fire a request on every
  // keystroke — only ~400ms after the user stops typing.
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 400);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  return (
    <FilterBar>
      <SearchField
        value={localSearch}
        onChange={setLocalSearch}
        placeholder={`Search ${entityPluralName.toLowerCase()}...`}
      />

      {showCategory && (
        <FilterSelect
          label={`Filter by ${categoryLabel.toLowerCase()}`}
          value={categoryId || ALL_OPTION}
          onValueChange={(value) =>
            onCategoryChange(value === ALL_OPTION ? "" : value)
          }
          options={[
            { value: ALL_OPTION, label: `All ${categoryLabel}` },
            ...categories.map((category) => ({
              value: String(category.id),
              label: category.name,
            })),
          ]}
        />
      )}

      {showSort && (
        <>
          <FilterSelect
            label="Sort by"
            value={sort}
            onValueChange={onSortChange}
            options={SORT_OPTIONS}
          />

          <FilterSelect
            label="Sort direction"
            value={order}
            onValueChange={onOrderChange}
            options={ORDER_OPTIONS}
          />
        </>
      )}
    </FilterBar>
  );
}

export default memo(ApplicationFilters);
