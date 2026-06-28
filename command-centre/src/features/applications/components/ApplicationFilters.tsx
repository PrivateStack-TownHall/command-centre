import { Input } from "@/components/ui/input";

interface ApplicationFiltersProps {
  search: string;
  categoryId: string;
  sort: string;
  order: string;

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
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onOrderChange,
}: ApplicationFiltersProps) {
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
        placeholder="Search coffees..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="
          min-w-[280px]
          flex-1
          border-slate-200
          bg-white
          focus-visible:border-ring focus-visible:ring-[0.5px] focus-visible:ring-ring/50
        "
      />

      <Input
        placeholder="Category ID"
        value={categoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="
          w-[180px]
          border-slate-200
          bg-white
          focus-visible:border-ring focus-visible:ring-[0.5px] focus-visible:ring-ring/50
        "
      />

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
    </div>
  );
}

export default ApplicationFilters;
