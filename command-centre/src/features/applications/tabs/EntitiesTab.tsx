import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/data-table/DataTable";

interface EntitiesTabProps<TData> {
  entityName: string;
  entityPluralName: string;
  columns: ColumnDef<TData>[];
  data: TData[];
}

function EntitiesTab<TData>({
  entityName,
  entityPluralName,
  columns,
  data,
}: EntitiesTabProps<TData>) {
  return (
    <div className="space-y-6">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

export default EntitiesTab;
