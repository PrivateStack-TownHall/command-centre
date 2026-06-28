import type { ColumnDef } from "@tanstack/react-table";

import DataTableWrapper from "./DataTable/DataTableWrapper";

interface EntityTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

function EntityTable<TData>({ columns, data }: EntityTableProps<TData>) {
  return <DataTableWrapper columns={columns} data={data} />;
}

export default EntityTable;
