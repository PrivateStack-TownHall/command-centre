import { useMemo, useState } from "react";

import PageHeader from "@/components/shared/page/PageHeader";

import ApplicationPagination from "@/features/applications/components/ApplicationPagination";

import ReviewFeed from "../components/ReviewFeed";
import ReviewFilter from "../components/ReviewFilter";
import ReviewStats from "../components/ReviewStats";

import { useProductReviews } from "../hooks/useProductReviews";

import type { ProductReview } from "../types/product-review.type";

const ITEMS_PER_PAGE = 8;

function ReviewPage() {
  const [search, setSearch] = useState("");
  const [application, setApplication] = useState("");
  const [rating, setRating] = useState("");
  const [sort, setSort] = useState("latest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const { data: reviews = [], isLoading } = useProductReviews();

  const products = useMemo<ProductReview[]>(() => {
    const grouped = new Map<number, ProductReview>();

    reviews.forEach((review: any) => {
      const productId = review.productId;

      if (!grouped.has(productId)) {
        grouped.set(productId, {
          productId,
          productName: review.product?.name ?? `Product #${productId}`,

          productDescription: review.product?.description ?? "",
          productAppType: review.product?.appType ?? "",
          imageUrl: review.product?.images?.[0]?.imageUrl ?? "",
          reviewUser: review.user?.fullName ?? "Anonymous",
          averageRating: 0,
          totalReviews: 0,
          appId: review.appId,
          appName: review.appName,
          appEmoji: review.appEmoji,
          reviews: [],
        });
      }

      grouped.get(productId)?.reviews.push(review);
    });

    return Array.from(grouped.values()).map((product) => ({
      ...product,

      totalReviews: product.reviews.length,

      averageRating:
        product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length,
    }));
  }, [reviews]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (application) {
      result = result.filter((product) => product.appId === application);
    }

    if (search) {
      result = result.filter(
        (product) =>
          product.productName.toLowerCase().includes(search.toLowerCase()) ||
          product.reviews.some((review) =>
            review.comment.toLowerCase().includes(search.toLowerCase()),
          ),
      );
    }

    if (rating) {
      result = result.filter(
        (product) => Math.floor(product.averageRating) >= Number(rating),
      );
    }

    if (sort === "highest") {
      result.sort((a, b) => b.averageRating - a.averageRating);
    }

    if (sort === "lowest") {
      result.sort((a, b) => a.averageRating - b.averageRating);
    }

    return result;
  }, [products, application, search, rating, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);

  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const totalReviews = products.reduce(
    (acc, product) => acc + product.totalReviews,
    0,
  );

  const averageRating =
    products.length > 0
      ? products.reduce((acc, product) => acc + product.averageRating, 0) /
        products.length
      : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Reviews"
          description="Customer feedback across the ecosystem."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        description="Customer feedback across the ecosystem."
      />

      <ReviewStats
        totalReviews={totalReviews}
        averageRating={averageRating}
        totalProducts={products.length}
      />

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
        onSortChange={setSort}
        onViewChange={setView}
      />

      <ReviewFeed products={paginatedProducts} view={view} />

      <ApplicationPagination
        page={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export default ReviewPage;
