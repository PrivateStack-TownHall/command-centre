import { useMemo, useState } from "react";

import { Leaf, Search, Smile, Star, X } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import ApplicationPagination from "@/features/applications/components/ApplicationPagination";

import { extractTags } from "../utils/extractTags";
import { timeAgo } from "../utils/timeAgo";

import type { ProductReview } from "../types/product-review.type";

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductReview;
}

const REVIEWS_PER_PAGE = 5;

function ReviewModal({ open, onOpenChange, product }: ReviewModalProps) {
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);

  const allReviews = product.reviews;

  const averageRating =
    allReviews.reduce((acc, review) => acc + review.rating, 0) /
    allReviews.length;

  const sentiment = Math.round((averageRating / 5) * 100);

  const filteredReviews = useMemo(() => {
    let result = [...allReviews];

    if (search) {
      const keyword = search.toLowerCase();
      result = result.filter(
        (review) =>
          review.comment.toLowerCase().includes(keyword) ||
          (review.user?.fullName ?? "").toLowerCase().includes(keyword),
      );
    }

    if (rating) {
      result = result.filter((review) => review.rating === Number(rating));
    }

    if (sort === "recent") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime(),
      );
    } else if (sort === "highest") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === "lowest") {
      result.sort((a, b) => a.rating - b.rating);
    }

    return result;
  }, [allReviews, search, rating, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);

  const paginatedReviews = filteredReviews.slice(
    (safePage - 1) * REVIEWS_PER_PAGE,
    safePage * REVIEWS_PER_PAGE,
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setPage(1);
          setSearch("");
          setRating("");
        }
        onOpenChange(next);
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="
          max-h-[90vh]
          max-w-5xl
          overflow-hidden
          rounded-2xl
          border-0
          p-0
        "
      >
        <div className="flex max-h-[90vh] flex-col bg-white">
          {/* header */}
          <div className="border-b border-slate-100 p-6">
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
                  className="h-24 w-24 rounded-xl border border-slate-200 object-cover"
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

              <div className="flex shrink-0 items-start gap-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
                  <p className="text-xs font-medium text-slate-500">
                    Customer Sentiment
                  </p>
                  <div className="mt-1 flex items-center justify-center gap-1.5 text-emerald-600">
                    <Smile className="h-6 w-6" />
                    <span className="text-2xl font-bold text-emerald-700">
                      {sentiment}%
                    </span>
                  </div>
                  <p className="text-xs text-emerald-600">Positive</p>
                </div>

                <button
                  onClick={() => onOpenChange(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* body: 2 columns */}
          <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-[280px_1fr]">
            {/* left column */}
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">
                  Overall Rating
                </p>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-slate-900">
                    {averageRating.toFixed(1)}
                  </span>

                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${
                          index < Math.round(averageRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  {allReviews.length} review{allReviews.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-semibold text-slate-900">
                    About This Product
                  </p>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {product.productDescription ||
                    "No description available for this product yet."}
                </p>
              </div>
            </div>

            {/* right column */}
            <div className="min-w-0 space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Customer Reviews
                </h3>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-600">
                  {filteredReviews.length}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[200px] flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search reviews..."
                    className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                <select
                  value={rating}
                  onChange={(e) => {
                    setRating(e.target.value);
                    setPage(1);
                  }}
                  className="h-10 rounded-lg border border-slate-200 px-2 text-sm"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-10 rounded-lg border border-slate-200 px-2 text-sm"
                >
                  <option value="recent">Most Recent</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </div>

              <div className="space-y-3">
                {paginatedReviews.length === 0 && (
                  <p className="py-8 text-center text-sm text-slate-400">
                    No reviews match your filters.
                  </p>
                )}

                {paginatedReviews.map((review) => {
                  const tags = extractTags(review.comment);

                  return (
                    <div
                      key={review.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {(review.user?.fullName ?? "A").charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {review.user?.fullName ??
                                `Customer #${review.userId}`}
                            </p>
                            <p className="text-xs text-slate-400">
                              {timeAgo(review.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-0.5">
                          {Array.from({ length: review.rating }).map(
                            (_, index) => (
                              <Star
                                key={index}
                                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                              />
                            ),
                          )}
                        </div>
                      </div>

                      <p className="mt-3 text-sm italic text-slate-600">
                        &ldquo;{review.comment}&rdquo;
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

              {filteredReviews.length > 0 && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-500">
                    Showing {(safePage - 1) * REVIEWS_PER_PAGE + 1}–
                    {Math.min(
                      safePage * REVIEWS_PER_PAGE,
                      filteredReviews.length,
                    )}{" "}
                    of {filteredReviews.length} review
                    {filteredReviews.length === 1 ? "" : "s"}
                  </p>

                  <ApplicationPagination
                    page={safePage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReviewModal;
