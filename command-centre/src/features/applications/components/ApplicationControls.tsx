import { Input } from "@/components/ui/input";

interface ApplicationControlsProps {
  search: string;
  sort: string;
  order: string;
  categoryId: string;

  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onOrderChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

function ApplicationControls({
  search,
  sort,
  order,
  categoryId,
  onSearchChange,
  onSortChange,
  onOrderChange,
  onCategoryChange,
}: ApplicationControlsProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-64"
      />

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="h-10 rounded-md border border-slate-200 px-3"
      >
        <option value="createdAt">Created At</option>
        <option value="name">Name</option>
        <option value="price">Price</option>
        <option value="stock">Stock</option>
      </select>

      <select
        value={order}
        onChange={(e) => onOrderChange(e.target.value)}
        className="h-10 rounded-md border border-slate-200 px-3"
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>

      <Input
        placeholder="Category ID"
        value={categoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-40"
      />
    </div>
  );
}

export default ApplicationControls;
