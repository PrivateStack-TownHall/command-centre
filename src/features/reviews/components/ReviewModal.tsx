import { useMemo, useState } from "react";

import { Smile, Star } from "lucide-react";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

import ApplicationPagination from "@/features/applications/components/ApplicationPagination";

import { extractTags } from "../utils/extractTags";

import type { ProductReview } from "../types/product-review.type";

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductReview;
}

const REVIEWS_PER_PAGE = 5;

function ReviewModal({ open, onOpenChange, product }: ReviewModalProps) {
  const [page, setPage] = useState(1);

  const reviews = product.reviews;

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  const sentiment = Math.round((averageRating / 5) * 100);

  const totalPages = Math.max(1, Math.ceil(reviews.length / REVIEWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const paginatedReviews = useMemo(
    () =>
      reviews.slice(
        (safePage - 1) * REVIEWS_PER_PAGE,
        safePage * REVIEWS_PER_PAGE,
      ),
    [reviews, safePage],
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setPage(1);
        onOpenChange(next);
      }}
    >
      <DialogContent
        className="
          max-h-[90vh]
          max-w-5xl
          overflow-hidden
          rounded-xl
          border-0
          p-0
        "
      >
        <div
          className="
            flex
            max-h-[90vh]
            flex-col
            bg-gradient-to-br
            from-violet-50
            via-white
            to-indigo-50
          "
        >
          <DialogHeader className="border-b bg-white/60 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={product.imageUrl || "https://placehold.co/96x96"}
                  alt={product.productName}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://placehold.co/96x96";
                  }}
                  className="h-20 w-20 rounded-xl border border-slate-200 object-cover"
                />

                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {product.productName}
                  </h2>

                  <p className="mt-1 max-w-md text-sm text-slate-500">
                    {product.productDescription || "No description available."}
                  </p>

                  {product.productAppType && (
                    <span className="mt-2 inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      #{product.productAppType}
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-600">
                  <Smile className="h-5 w-5" />
                </div>
                <p className="mt-1 text-xl font-bold text-emerald-700">
                  {sentiment}%
                </p>
                <p className="text-xs text-emerald-600">Positive</p>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-4 gap-4 p-6">
            <div className="rounded-xl border bg-white p-4">
              <Star className="mb-3 h-5 w-5 text-amber-500" />
              <p className="text-xs text-slate-500">Average Rating</p>
              <h3 className="text-3xl font-bold">{averageRating.toFixed(1)}</h3>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs text-slate-500">Reviews</p>
              <h3 className="mt-6 text-3xl font-bold">{reviews.length}</h3>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs text-slate-500">Satisfaction</p>
              <h3 className="mt-6 text-3xl font-bold">{sentiment}%</h3>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <p className="text-xs text-slate-500">Five Star</p>
              <h3 className="mt-6 text-3xl font-bold">
                {reviews.filter((review) => review.rating === 5).length}
              </h3>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-6 pb-2">
            {paginatedReviews.map((review) => {
              const tags = extractTags(review.comment);

              return (
                <div key={review.id} className="rounded-xl border bg-white p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      {review.user?.fullName ?? `Customer #${review.userId}`}
                    </h4>

                    <div className="flex gap-1">
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <Star
                          key={index}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">
                    {review.comment}
                  </p>

                  {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t bg-white/60 p-4">
            <ApplicationPagination
              page={safePage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReviewModal;
