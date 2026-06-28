import type { ColumnDef } from "@tanstack/react-table";

import { ImageIcon, ExternalLink, Coffee } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { Image } from "../types/image.type";

export const imageColumns: ColumnDef<Image>[] = [
  {
    accessorKey: "id",

    header: "#",

    cell: ({ row }) => (
      <span className="font-semibold text-slate-500">#{row.original.id}</span>
    ),
  },

  {
    id: "product",

    header: "Product Image",

    cell: ({ row }) => {
      const image = row.original;

      return (
        <div className="flex items-center gap-4">
          <img
            src={image.imageUrl}
            alt={image.product.name}
            className="
              h-16
              w-16
              rounded-xl
              border
              border-slate-200
              object-cover
              shadow-sm
            "
          />

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4 text-amber-600" />

              <p className="font-semibold text-slate-900">
                {image.product.name}
              </p>
            </div>

            <p className="max-w-sm text-sm text-slate-500">
              {image.product.description}
            </p>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Product #{image.productId}
              </Badge>

              <Badge
                className="
                  bg-violet-100
                  text-violet-700
                  hover:bg-violet-100
                "
              >
                Sort #{image.sortOrder}
              </Badge>
            </div>
          </div>
        </div>
      );
    },
  },

  {
    id: "price",

    header: "Price",

    cell: ({ row }) => (
      <div>
        <p className="font-bold text-emerald-600">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(Number(row.original.product.price))}
        </p>

        <p className="text-xs text-slate-500">Current Price</p>
      </div>
    ),
  },

  {
    id: "inventory",

    header: "Inventory",

    cell: ({ row }) => (
      <div>
        <p className="font-semibold">{row.original.product.stock}</p>

        <p className="text-xs text-slate-500">Units Available</p>
      </div>
    ),
  },

  {
    id: "actions",

    header: "Image",

    cell: ({ row }) => (
      <a
        href={row.original.imageUrl}
        target="_blank"
        rel="noreferrer"
        className="
          inline-flex
          items-center
          gap-2
          rounded-lg
          border
          border-gray-200
          px-3
          py-2
          text-sm
          font-medium
          transition-colors
          hover:bg-[#8B5E3C]
          hover:text-white
        "
      >
        <ImageIcon className="h-4 w-4 " />
        Preview
        <ExternalLink className="h-3 w-3" />
      </a>
    ),
  },
];
