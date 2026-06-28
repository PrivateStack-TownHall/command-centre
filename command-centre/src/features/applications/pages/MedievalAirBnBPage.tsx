import { useState } from "react";

import PageContainer from "@/components/shared/page/PageContainer";
import PageHeader from "@/components/shared/page/PageHeader";
import EntityTabs from "@/components/shared/entity/EntityTabs";

import ApplicationFilters from "../components/ApplicationFilters";
import ApplicationPagination from "../components/ApplicationPagination";

import { APPLICATION_CONFIG } from "../config/application.config";

import { entityColumns } from "../columns/entity.columns";
import { categoryColumns } from "../columns/category.columns";
import { imageColumns } from "../columns/image.columns";
import { reviewColumns } from "../columns/review.columns";

import { useApplicationEntities } from "../hooks/useApplicationEntities";
import { useApplicationCategories } from "../hooks/useApplicationCategories";
import { useApplicationImages } from "../hooks/useApplicationImages";
import { useApplicationReviews } from "../hooks/useApplicationReviews";

import EntitiesTab from "../tabs/EntitiesTab";
import CategoriesTab from "../tabs/CategoriesTab";
import ImagesTab from "../tabs/ImagesTab";
import ReviewsTab from "../tabs/ReviewsTab";

const ITEMS_PER_PAGE = 10;

function KingsBrewPage() {
  const config = APPLICATION_CONFIG["medieval-airbnb"];

  const [activeTab, setActiveTab] = useState("entities");

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("asc");

  const [entitiesPage, setEntitiesPage] = useState(1);
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [imagesPage, setImagesPage] = useState(1);
  const [reviewsPage, setReviewsPage] = useState(1);

  const entitiesQuery = useApplicationEntities("medieval-airbnb", {
    search,
    categoryId,
    sort,
    order,
    page: entitiesPage,
    limit: ITEMS_PER_PAGE,
  });

  const categoriesQuery = useApplicationCategories("medieval-airbnb");
  const imagesQuery = useApplicationImages("medieval-airbnb");
  const reviewsQuery = useApplicationReviews("medieval-airbnb");
  const entities = entitiesQuery.data?.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const images = imagesQuery.data ?? [];
  const reviews = reviewsQuery.data ?? [];
  const paginatedCategories = categories.slice(
    (categoriesPage - 1) * ITEMS_PER_PAGE,
    categoriesPage * ITEMS_PER_PAGE,
  );
  const paginatedImages = images.slice(
    (imagesPage - 1) * ITEMS_PER_PAGE,
    imagesPage * ITEMS_PER_PAGE,
  );

  const paginatedReviews = reviews.slice(
    (reviewsPage - 1) * ITEMS_PER_PAGE,
    reviewsPage * ITEMS_PER_PAGE,
  );

  const categoryTotalPages = Math.ceil(categories.length / ITEMS_PER_PAGE) || 1;

  const imageTotalPages = Math.ceil(images.length / ITEMS_PER_PAGE) || 1;

  const reviewTotalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE) || 1;

  const entityMeta = entitiesQuery.data?.meta;

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <PageHeader
            title={config.app.name}
            description={config.app.description}
            badgeName={config.entityName}
            badgeColor={config.color ?? "mart"}
            badgeEmoji={config.emoji}
          />

          <div className="shrink-0">
            <EntityTabs
              value={activeTab}
              onValueChange={setActiveTab}
              tabs={[
                {
                  value: "entities",
                  label: config.entityPluralName,
                  badge: entityMeta?.total ?? 0,
                },

                {
                  value: "categories",
                  label: "Categories",
                  badge: categories.length,
                },

                {
                  value: "images",
                  label: "Images",
                  badge: images.length,
                },

                {
                  value: "reviews",
                  label: "Reviews",
                  badge: reviews.length,
                },
              ]}
            />
          </div>
        </div>

        <ApplicationFilters
          search={search}
          categoryId={categoryId}
          sort={sort}
          order={order}
          onSearchChange={setSearch}
          onCategoryChange={setCategoryId}
          onSortChange={setSort}
          onOrderChange={setOrder}
        />

        {activeTab === "entities" && (
          <>
            <EntitiesTab
              entityName={config.entityName}
              entityPluralName={config.entityPluralName}
              columns={entityColumns}
              data={entities}
            />

            <ApplicationPagination
              page={entitiesPage}
              totalPages={entityMeta?.totalPages ?? 1}
              onPageChange={setEntitiesPage}
            />
          </>
        )}

        {activeTab === "categories" && (
          <>
            <CategoriesTab
              columns={categoryColumns}
              data={paginatedCategories}
            />

            <ApplicationPagination
              page={categoriesPage}
              totalPages={categoryTotalPages}
              onPageChange={setCategoriesPage}
            />
          </>
        )}

        {activeTab === "images" && (
          <>
            <ImagesTab columns={imageColumns} data={paginatedImages} />

            <ApplicationPagination
              page={imagesPage}
              totalPages={imageTotalPages}
              onPageChange={setImagesPage}
            />
          </>
        )}

        {activeTab === "reviews" && (
          <>
            <ReviewsTab columns={reviewColumns} data={paginatedReviews} />

            <ApplicationPagination
              page={reviewsPage}
              totalPages={reviewTotalPages}
              onPageChange={setReviewsPage}
            />
          </>
        )}
      </div>
    </PageContainer>
  );
}

export default KingsBrewPage;
