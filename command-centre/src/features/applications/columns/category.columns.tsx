import type { ColumnDef } from "@tanstack/react-table";

import { FolderTree, Package } from "lucide-react";

import type { Category } from "../types/category.type";

export const categoryColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",

    header: "#",

    cell: ({ row }) => (
      <span className="font-semibold text-slate-500">#{row.original.id}</span>
    ),
  },

  {
    id: "category",

    header: "Category",

    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              bg-amber-100
              text-amber-600
            "
          >
            <FolderTree className="h-6 w-6" />
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-slate-900">{category.name}</p>

            <p className="max-w-md text-sm text-slate-500">
              {category.description || "No description available."}
            </p>
          </div>
        </div>
      );
    },
  },

  {
    id: "products",

    header: "Products",

    cell: () => (
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-slate-500" />

        <span className="text-slate-600">Associated Products</span>
      </div>
    ),
  },
];
