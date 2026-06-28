import type { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/data-table/DataTable";

interface OrdersTabProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

function OrdersTab<TData>({ columns, data }: OrdersTabProps<TData>) {
  return (
    <div className="space-y-6">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default OrdersTab;
