import { memo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Loading from "@/components/shared/Loading";
import EmptyState from "@/components/shared/state/EmptyState";
import ErrorState from "@/components/shared/state/ErrorState";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  isError?: boolean;
  /** Optional — makes rows clickable (used for Leather Shelf's contextual
   *  per-book reviews, Opsi C). */
  onRowClick?: (row: TData) => void;
}

function DataTable<TData>({
  columns,
  data,
  isLoading,
  isError,
  onRowClick,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),

    getPaginationRowModel: getPaginationRowModel(),

    getSortedRowModel: getSortedRowModel(),

    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) {
    return (
      <div className="rounded-sm border border-gray-200 bg-white">
        <Loading label="Fetching data..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-sm border border-gray-200 bg-white">
        <ErrorState description="Couldn't load this data. Please try again shortly." />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-sm border border-gray-200 bg-white">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-gray-200 bg-white">
      <Table>
        <TableHeader className="bg-slate-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border border-gray-200">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="border border-gray-200">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => onRowClick?.(row.original)}
              className={`hover:bg-slate-50 transition-colors border border-gray-200 ${
                onRowClick ? "cursor-pointer" : ""
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="border border-gray-200">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default memo(DataTable) as typeof DataTable;
