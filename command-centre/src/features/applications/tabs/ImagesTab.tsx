import type { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/data-table/DataTable";

interface ImagesTabProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

function ImagesTab<TData>({ columns, data }: ImagesTabProps<TData>) {
  return (
    <div className="space-y-6">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default ImagesTab;
