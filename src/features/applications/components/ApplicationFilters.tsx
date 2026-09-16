import { memo, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

interface ApplicationFiltersProps {
  search: string;
  categoryId: string;
  sort: string;
  order: string;
  entityPluralName?: string;
  /** Only the paginated main-entity resource supports server-side
   *  category/sort/order params — other resources just get the search box. */
  showAdvanced?: boolean;
  /** Category options for the dropdown — { id, name } pulled from the
   *  app's own Categories resource, so people pick a name instead of
   *  having to know/guess a raw numeric id. */
  categories?: { id: number | string; name: string }[];

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onOrderChange: (value: string) => void;
}

function ApplicationFilters({
  search,
  categoryId,
  sort,
  order,
  entityPluralName = "items",
  showAdvanced = true,
  categories = [],
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
    <div
      className="
        mb-2
        flex
        w-full
        flex-wrap
        items-center
        gap-3
        rounded-md
        border
        border-slate-200
        bg-slate-50/50
        p-2
      "
    >
      <Input
        placeholder={`Search ${entityPluralName.toLowerCase()}...`}
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="
          min-w-[280px]
          flex-1
          border-slate-200
          bg-white
          focus-visible:border-ring focus-visible:ring-[0.5px] focus-visible:ring-ring/50
        "
      />

      {showAdvanced && (
        <>
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="
              h-10
              min-w-[180px]
              rounded-md
              border
              border-slate-200
              bg-white
              px-3
              text-sm
              text-slate-700
            "
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="
              h-10
              min-w-[160px]
              rounded-md
              border
              border-slate-200
              bg-white
              px-3
              text-sm
              text-slate-700
            "
          >
            <option value="createdAt">Created At</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="stock">Stock</option>
          </select>

          <select
            value={order}
            onChange={(e) => onOrderChange(e.target.value)}
            className="
              h-10
              min-w-[160px]
              rounded-md
              border
              border-slate-200
              bg-white
              px-3
              text-sm
              text-slate-700
            "
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </>
      )}
    </div>
  );
}

export default memo(ApplicationFilters);
