import ProductReviewCard from "./ProductReviewCard";
import ReviewListRow from "./ReviewListRow";

import { FEED_GRID_CLASS } from "@/components/shared/filters/FeedSkeleton";
import type { FeedView } from "@/components/shared/filters/ViewToggle";

import type { ProductReview } from "../types/product-review.type";

interface ReviewFeedProps {
  products: ProductReview[];
  view: FeedView;
}

function ReviewFeed({ products, view }: ReviewFeedProps) {
  if (!products.length) {
    return (
      <div
        className="
          flex
          h-64
          items-center
          justify-center
          rounded-2xl
          border
          border-dashed
          border-slate-300
          bg-slate-50
          text-slate-500
        "
      >
        No reviews found
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="space-y-3">
        {products.map((product) => (
          <ReviewListRow key={product.key} product={product} />
        ))}
      </div>
    );
  }

  return (
    <div className={FEED_GRID_CLASS}>
      {products.map((product) => (
        <ProductReviewCard key={product.key} product={product} />
      ))}
    </div>
  );
}

export default ReviewFeed;
