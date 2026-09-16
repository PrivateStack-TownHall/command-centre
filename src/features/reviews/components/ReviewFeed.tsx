import ProductReviewCard from "./ProductReviewCard";
import ReviewListRow from "./ReviewListRow";

import type { ProductReview } from "../types/product-review.type";

interface ReviewFeedProps {
  products: ProductReview[];
  view: "grid" | "list";
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
          <ReviewListRow key={product.productId} product={product} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="
        grid
        gap-4
        md:grid-cols-2
        xl:grid-cols-4
      "
    >
      {products.map((product) => (
        <ProductReviewCard key={product.productId} product={product} />
      ))}
    </div>
  );
}

export default ReviewFeed;
