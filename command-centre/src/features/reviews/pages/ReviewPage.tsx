import { useMemo, useState } from "react";

import PageHeader from "@/components/shared/page/PageHeader";
import FeedSkeleton, {
  StatsSkeleton,
} from "@/components/shared/filters/FeedSkeleton";
import { ALL_OPTION } from "@/components/shared/filters/FilterSelect";
import type { FeedView } from "@/components/shared/filters/ViewToggle";

import ApplicationLoadStatus from "@/features/applications/components/ApplicationLoadStatus";
import ApplicationPagination from "@/features/applications/components/ApplicationPagination";

import ReviewFeed from "../components/ReviewFeed";
import ReviewFilter from "../components/ReviewFilter";
import ReviewStats from "../components/ReviewStats";

import { useProductReviews } from "../hooks/useProductReviews";

import {
  averageRatingOf,
  groupReviewsByProduct,
  sortProductReviews,
} from "../utils/group-reviews";

const ITEMS_PER_PAGE = 8;

function ReviewPage() {
  const [search, setSearch] = useState("");
  const [application, setApplication] = useState(ALL_OPTION);
  const [rating, setRating] = useState(ALL_OPTION);
  const [sort, setSort] = useState("latest");
  const [view, setView] = useState<FeedView>("grid");
  const [page, setPage] = useState(1);

  const {
    data: reviews,
    isLoading,
    statuses,
    retryFailed,
  } = useProductReviews();

  // Stats follow the application filter, like on the Orders page.
  const applicationReviews = useMemo(
    () =>
      application === ALL_OPTION
        ? reviews
        : reviews.filter((review) => review.appId === application),
    [reviews, application],
  );

  const products = useMemo(
    () => groupReviewsByProduct(applicationReviews),
    [applicationReviews],
  );

  const filteredProducts = useMemo(() => {
    let result = products;
    const keyword = search.trim().toLowerCase();

    if (keyword) {
      result = result.filter(
        (product) =>
          product.productName.toLowerCase().includes(keyword) ||
          product.reviews.some((review) =>
            (review.comment ?? "").toLowerCase().includes(keyword),
          ),
      );
    }

    if (rating !== ALL_OPTION) {
      result = result.filter(
        (product) => Math.floor(product.averageRating) >= Number(rating),
      );
    }

    return sortProductReviews(result, sort);
  }, [products, search, rating, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);

  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  // Weighted by review, not by product — a product with 1 review must not
  // count as much as a product with 50.
  const averageRating = useMemo(
    () => averageRatingOf(applicationReviews),
    [applicationReviews],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <PageHeader
          title="Reviews"
          description="Real reviews from across our ecosystem."
        />

        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <ReviewStats
            totalReviews={applicationReviews.length}
            averageRating={averageRating}
            totalProducts={products.length}
          />
        )}
      </div>

      <ReviewFilter
        search={search}
        application={application}
        rating={rating}
        sort={sort}
        view={view}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onApplicationChange={(value) => {
          setApplication(value);
          setPage(1);
        }}
        onRatingChange={(value) => {
          setRating(value);
          setPage(1);
        }}
        onSortChange={(value) => {
          setSort(value);
          setPage(1);
        }}
        onViewChange={setView}
      />

      <ApplicationLoadStatus statuses={statuses} onRetry={retryFailed} />

      {isLoading ? (
        <FeedSkeleton view={view} />
      ) : (
        <>
          <ReviewFeed products={paginatedProducts} view={view} />

          <ApplicationPagination
            page={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

export default ReviewPage;
