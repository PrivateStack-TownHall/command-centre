import { useState } from "react";

import { ChevronRight, Star } from "lucide-react";

import ReviewModal from "./ReviewModal";

import type { ProductReview } from "../types/product-review.type";

interface ReviewListRowProps {
  product: ProductReview;
}

function ReviewListRow({ product }: ReviewListRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          flex
          w-full
          items-center
          gap-4
          rounded-xl
          border
          border-slate-200
          bg-white
          p-4
          text-left
          shadow-sm
          transition-all
          hover:-translate-y-0.5
          hover:shadow-md
        "
      >
        <img
          src={product.imageUrl || "https://placehold.co/80x80"}
          alt={product.productName}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://placehold.co/80x80";
          }}
          className="h-14 w-14 shrink-0 rounded-lg border border-slate-200 object-cover"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-900">
            {product.productName}
          </p>
          <p className="truncate text-sm text-slate-500">
            {product.productDescription}
          </p>
          <p className="truncate text-xs text-slate-400">
            {product.appEmoji} {product.appName}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1 text-amber-500">
          <Star className="h-4 w-4 fill-amber-400" />
          <span className="text-sm font-semibold text-slate-900">
            {product.averageRating.toFixed(1)}
          </span>
        </div>

        <span className="w-24 shrink-0 text-right text-sm text-slate-500">
          {product.totalReviews} review{product.totalReviews === 1 ? "" : "s"}
        </span>

        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
      </button>

      <ReviewModal
        open={open}
        onOpenChange={setOpen}
        product={product}
      />
    </>
  );
}

export default ReviewListRow;
