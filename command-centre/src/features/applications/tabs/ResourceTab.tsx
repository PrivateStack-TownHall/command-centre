import { memo } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import DataTable from "@/components/data-table/DataTable";

interface ResourceTabProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  isError?: boolean;
  onRowClick?: (row: TData) => void;
}

/**
 * One generic tab body reused by every resource of every application
 * (Coffees, Posts, Departments, Warehouses, ...) — replaces the old
 * EntitiesTab/CategoriesTab/ImagesTab/ReviewsTab, which were four
 * near-identical wrappers around the same DataTable.
 */
function ResourceTab<TData>({
  columns,
  data,
  isLoading,
  isError,
  onRowClick,
}: ResourceTabProps<TData>) {
  return (
    <div className="space-y-6">
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isError={isError}
        onRowClick={onRowClick}
      />
    </div>
  );
}

export default memo(ResourceTab) as typeof ResourceTab;
