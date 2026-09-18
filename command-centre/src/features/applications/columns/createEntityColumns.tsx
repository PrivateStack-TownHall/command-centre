import type { ColumnDef } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import { CircleCheck, CircleX, Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { badgeVariants, type BadgeColor } from "@/lib/badge-variants";

import type { Entity } from "../types/entity.type";

export interface EntityColumnsConfig {
  /** Icon shown next to the entity name (e.g. Coffee, BookOpen, Home). */
  icon: LucideIcon;
  /** Theme color, matched against badgeVariants (see lib/badge-variants.ts). */
  color: BadgeColor;
  /** Unit label shown under the price, e.g. "per cup", "per night". */
  unitLabel?: string;
}

/**
 * Builds the "product-like" table columns (#, name, inventory, price,
 * status) themed for a specific application. This assumes the exact
 * shape confirmed in commerce-core's Prisma schema: name, description,
 * price, stock, isActive, category.name, images[].imageUrl.
 *
 * Only use this for apps that really have that shape — commerce-core
 * (Kings Brew, Castle Kitchen, Byte Burger, Quantum Mart, Trade Hub) and
 * the Nomad/Medieval Airbnb templates, which intentionally mirror it
 * until their real API exists. Everything else (operations-core,
 * WareTrack) has a genuinely different shape — use createAutoColumns
 * for those instead of guessing field names that don't exist.
 */
export function createEntityColumns({
  icon: Icon,
  color,
  unitLabel = "per item",
}: EntityColumnsConfig): ColumnDef<Entity>[] {
  return [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => (
        <span className="font-semibold text-slate-500">
          #{row.original.id}
        </span>
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
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://placehold.co/80x80";
              }}
              className="h-12 w-12 rounded-xl object-cover shadow-sm"
            />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />

                <p className="font-semibold text-slate-900">
                  {product.name}
                </p>
              </div>

              <p className="max-w-sm text-sm text-slate-500">
                {product.description}
              </p>

              <Badge variant="secondary" className={badgeVariants[color]}>
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
          <p className="text-lg font-bold text-emerald-600">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(row.original.price)}
          </p>

          <p className="text-xs text-slate-500">{unitLabel}</p>
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
}
