import type { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/data-table/DataTable";

interface ReviewsTabProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

function ReviewsTab<TData>({ columns, data }: ReviewsTabProps<TData>) {
  return (
    <div className="space-y-6">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default ReviewsTab;
