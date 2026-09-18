import type { ColumnDef } from "@tanstack/react-table";

import { MessageSquareText, Coffee, Star } from "lucide-react";

import type { Review } from "../types/review.type";

export const reviewColumns: ColumnDef<Review>[] = [
  {
    accessorKey: "id",

    header: "#",

    cell: ({ row }) => (
      <span className="font-semibold text-slate-500">#{row.original.id}</span>
    ),
  },

  {
    id: "review",

    header: "Customer Review",

    cell: ({ row }) => {
      const review = row.original;

      return (
        <div className="flex items-start gap-4">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-blue-100
              text-blue-600
            "
          >
            <MessageSquareText className="h-5 w-5" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{review.user.fullName}</span>

              <span className="text-xs text-slate-500">
                {review.user.email}
              </span>
            </div>

            <p className="max-w-lg text-sm text-slate-600">{review.comment}</p>
          </div>
        </div>
      );
    },
  },

  {
    id: "product",

    header: "Product",

    cell: ({ row }) => {
      const product = row.original.product;

      return (
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              bg-amber-100
              text-amber-600
            "
          >
            <Coffee className="h-4 w-4" />
          </div>

          <div>
            <p className="font-medium">{product.name}</p>

            <p className="text-xs text-slate-500">Product #{product.id}</p>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "rating",

    header: "Rating",

    cell: ({ row }) => {
      const rating = row.original.rating;

      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`h-4 w-4 ${
                index < rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-300"
              }`}
            />
          ))}
        </div>
      );
    },
  },
];
