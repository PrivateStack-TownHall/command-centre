import { useState } from "react";

import { ChevronRight, MessageSquareText, Package, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

import ReviewModal from "./ReviewModal";

import type { ProductReview } from "../types/product-review.type";

interface ProductReviewCardProps {
  product: ProductReview;
}

function ProductReviewCard({ product }: ProductReviewCardProps) {
  const [open, setOpen] = useState(false);

  const previewReviews = product.reviews.slice(0, 2);

  return (
    <>
      <div
        className="
          flex
          h-[420px]
          flex-col
          overflow-hidden
          rounded-md
          border
          border-slate-200
          bg-white
          shadow-sm
          transition-all
          hover:shadow-md
        "
      >
        <div
          className="
            border-b
            border-slate-100
            bg-gradient-to-br
            from-amber-50
            via-white
            to-orange-50
            p-3
          "
        >
          <div className="flex gap-3">
            <img
              src={
                product.imageUrl ||
                "https://images.unsplash.com/photo-1510707577719-ae7c14805e0f"
              }
              alt={product.productName}
              className="
                h-20
                w-20
                rounded-md
                border
                border-slate-200
                object-cover
              "
            />

            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-1 text-base font-bold text-slate-900">
                {product.productName}
              </h3>

              <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                {product.productDescription}
              </p>

              <div className="mt-3 flex items-center gap-1">
                {Array.from({
                  length: Math.round(product.averageRating),
                }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  />
                ))}

                <span className="ml-1 text-sm font-semibold">
                  {product.averageRating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="
            grid
            grid-cols-2
            gap-2
            border-b
            border-slate-100
            p-3
          "
        >
          <div
            className="
              rounded-md
              border
              border-slate-100
              bg-slate-50
              p-2
            "
          >
            <div className="flex items-center gap-2">
              <Package className="h-3.5 w-3.5 text-violet-500" />

              <span className="text-xs text-slate-500">Product Type</span>
            </div>

            <p className="mt-1 text-sm font-semibold">
              #{product.productAppType}
            </p>
          </div>

          <div
            className="
              rounded-md
              border
              border-slate-100
              bg-slate-50
              p-2
            "
          >
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-3.5 w-3.5 text-blue-500" />

              <span className="text-xs text-slate-500">Reviews</span>
            </div>

            <p className="mt-1 text-sm font-semibold">{product.totalReviews}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-3">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900">
              Latest Reviews
            </h4>

            <span className="text-xs text-slate-500">
              {product.totalReviews} Total
            </span>
          </div>

          <div className="flex-1 space-y-2">
            {previewReviews.map((review) => (
              <div
                key={review.id}
                className="
                  rounded-md
                  border
                  border-slate-100
                  bg-slate-50
                  p-3
                "
              >
                <div className="flex items-center justify-between">
                  <span className="truncate text-xs font-medium">
                    {review.user?.fullName ?? `Customer #${review.userId}`}
                  </span>

                  <div className="flex gap-0.5">
                    {Array.from({
                      length: review.rating,
                    }).map((_, index) => (
                      <Star
                        key={index}
                        className="h-3 w-3 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>

                <p
                  className="
                    mt-2
                    line-clamp-2
                    min-h-[34px]
                    text-xs
                    text-slate-600
                  "
                >
                  {review.comment}
                </p>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => setOpen(true)}
            className="mt-3 rounded-md"
          >
            View All Reviews
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <ReviewModal
        open={open}
        onOpenChange={setOpen}
        productName={product.productName}
        reviews={product.reviews}
      />
    </>
  );
}

export default ProductReviewCard;
