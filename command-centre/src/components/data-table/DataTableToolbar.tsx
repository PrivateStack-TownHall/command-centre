import type { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";

import DataTableViewOptions from "./DataTableViewOptions";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

function DataTableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Input
        placeholder="Search..."
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="max-w-sm"
      />

      <DataTableViewOptions table={table} />
    </div>
  );
}

export default DataTableToolbar;
