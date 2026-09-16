import { useState } from "react";

import { ArrowRight, Star } from "lucide-react";

import ReviewModal from "./ReviewModal";
import { timeAgo } from "../utils/timeAgo";

import type { ProductReview } from "../types/product-review.type";

interface ProductReviewCardProps {
  product: ProductReview;
}

function ProductReviewCard({ product }: ProductReviewCardProps) {
  const [open, setOpen] = useState(false);

  const featuredReview = product.reviews[0];

  return (
    <>
      <div
        className="
          flex
          h-full
          flex-col
          rounded-xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
          transition-all
          hover:-translate-y-0.5
          hover:shadow-md
        "
      >
        <div className="flex gap-3">
          <img
            src={product.imageUrl || "https://placehold.co/112x112"}
            alt={product.productName}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://placehold.co/112x112";
            }}
            className="h-24 w-24 shrink-0 rounded-lg border border-slate-100 object-cover"
          />

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-1 font-bold text-slate-900">
              {product.productName}
            </h3>

            <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
              {product.productDescription}
            </p>

            <div className="mt-2 flex items-center gap-1">
              {Array.from({ length: Math.round(product.averageRating) }).map(
                (_, index) => (
                  <Star
                    key={index}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  />
                ),
              )}

              <span className="ml-1 text-sm font-bold text-slate-900">
                {product.averageRating.toFixed(1)}
              </span>

              <span className="text-xs text-slate-400">
                ({product.totalReviews} review
                {product.totalReviews === 1 ? "" : "s"})
              </span>
            </div>
          </div>
        </div>

        {featuredReview && (
          <>
            <div className="mt-3 rounded-lg bg-slate-50 p-3">
              <p className="line-clamp-2 text-sm italic text-slate-600">
                &ldquo;{featuredReview.comment}&rdquo;
              </p>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {(featuredReview.user?.fullName ?? "A").charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-700">
                  {featuredReview.user?.fullName ?? "Anonymous"}
                </p>
                <p className="text-[11px] text-slate-400">
                  {timeAgo(featuredReview.createdAt)}
                </p>
              </div>
            </div>
          </>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="rounded-md bg-violet-50 px-2 py-1 text-[11px] font-semibold text-violet-600">
            #{product.productAppType || "PRODUCT"}
          </span>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            View all reviews
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <ReviewModal open={open} onOpenChange={setOpen} product={product} />
    </>
  );
}

export default ProductReviewCard;
