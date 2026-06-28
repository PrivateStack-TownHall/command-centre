import type { ColumnDef } from "@tanstack/react-table";

import { Coffee, Package, CircleCheck, CircleX } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { Entity } from "../types/entity.type";

export const entityColumns: ColumnDef<Entity>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => (
      <span className="font-semibold text-slate-500">#{row.original.id}</span>
    ),
  },

  {
    id: "product",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original;
      const image =
        product.images?.[0]?.imageUrl || "https://placehold.co/80x80";
      return (
        <div className="flex items-center gap-4">
          <img
            src={image}
            alt={product.name}
            className="
              h-12
              w-12
              rounded-xl
              object-cover
              shadow-sm
            "
          />

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4 text-amber-600" />

              <p className="font-semibold text-slate-900">{product.name}</p>
            </div>

            <p className="max-w-sm text-sm text-slate-500">
              {product.description}
            </p>

            <Badge variant="secondary" className="bg-[#8B5E3C] text-white">
              {product.category?.name}
            </Badge>
          </div>
        </div>
      );
    },
  },

  {
    id: "inventory",
    header: "Inventory",
    cell: ({ row }) => {
      const stock = row.original.stock;

      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-slate-500" />

            <span className="font-semibold">{stock}</span>
          </div>

          <Badge
            className={
              stock <= 20
                ? "bg-red-100 text-red-700 hover:bg-red-100"
                : stock <= 50
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
            }
          >
            {stock <= 20
              ? "Low Stock"
              : stock <= 50
                ? "Medium Stock"
                : "In Stock"}
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div>
        <p className="font-bold text-lg text-emerald-600">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(row.original.price)}
        </p>
        <p className="text-xs text-slate-500">per item</p>
      </div>
    ),
  },

  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) =>
      row.original.isActive ? (
        <div className="flex items-center gap-2">
          <CircleCheck className="h-4 w-4 text-emerald-600" />
          <span className="font-medium text-emerald-700">Active</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <CircleX className="h-4 w-4 text-red-600" />
          <span className="font-medium text-red-700">Inactive</span>
        </div>
      ),
  },
];
