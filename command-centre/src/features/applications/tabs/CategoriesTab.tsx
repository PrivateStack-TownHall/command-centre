import type { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/data-table/DataTable";

interface CategoriesTabProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

function CategoriesTab<TData>({ columns, data }: CategoriesTabProps<TData>) {
  return (
    <div className="space-y-6">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default CategoriesTab;
