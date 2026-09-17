import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Tabs as TabsPrimitive } from "radix-ui";
import { Navigate, useParams } from "react-router-dom";

import PageContainer from "@/components/shared/page/PageContainer";
import PageHeader from "@/components/shared/page/PageHeader";
import DetailPanel from "@/components/shared/detail-panel/DetailPanel";
import DetailPanelHeader from "@/components/shared/detail-panel/DetailPanelHeader";
import Loading from "@/components/shared/Loading";
import EmptyState from "@/components/shared/state/EmptyState";
import ErrorState from "@/components/shared/state/ErrorState";

import { PATHS } from "@/app/routes/paths";

import ApplicationFilters from "../components/ApplicationFilters";
import ApplicationPagination from "../components/ApplicationPagination";
import ResourceStatCards from "../components/ResourceStatCards";

import {
  APPLICATION_CONFIG,
  type ApplicationId,
  type ResourceConfig,
} from "../config/application.config";

import {
  createAutoColumns,
  humanize,
  renderValue,
  HIDDEN_FIELDS,
} from "../columns/createAutoColumns";
import { useApplicationResource } from "../hooks/useApplicationResource";
import {
  buildResourceParams,
  filterRowsBySearch,
} from "../utils/resource-query";
import { useApplicationStats } from "../hooks/useApplicationStats";
import type { ResourceParams } from "../api/resource.api";
import { buildStatCards } from "../utils/stat-cards";

import ResourceTab from "../tabs/ResourceTab";

const ITEMS_PER_PAGE = 10;

// Stable fallback so `resources` keeps the same identity between renders
// (a fresh `[]` each render would invalidate every memo that depends on it).
const NO_RESOURCES: ResourceConfig[] = [];
const NO_ROWS: unknown[] = [];

const COUNT_ONLY_PARAMS: ResourceParams = { page: 1, limit: 1 };

const DEFAULT_FILTERS = {
  search: "",
  categoryId: "",
  sort: "createdAt",
  order: "desc",
};

/**
 * Generic page for every application in APPLICATION_CONFIG. Tabs are
 * fully data-driven from `config.resources` — commerce-core apps get
 * their original 4 tabs, operations-core/WareTrack get whatever
 * resources their real API actually has.
 *
 * Only the ACTIVE tab's resource is fetched. Badge counts come from the
 * app's /stats endpoint when available (config.statsEndpoint), so they
 * show up even for tabs that haven't been opened yet; apps without
 * /stats fall back to showing a count only once a tab has been visited.
 */
function ApplicationPageContent({ appId }: { appId: string | undefined }) {
  const isValidAppId = !!appId && appId in APPLICATION_CONFIG;
  const config = isValidAppId
    ? APPLICATION_CONFIG[appId as ApplicationId]
    : undefined;

  const resources = config?.resources ?? NO_RESOURCES;

  // Open the first resource that can actually be fetched without a token.
  const firstOpenResource =
    resources.find((r) => !r.requiresAuth) ?? resources[0];

  const [activeTab, setActiveTab] = useState(firstOpenResource?.key ?? "");

  const [search, setSearch] = useState(DEFAULT_FILTERS.search);
  const [categoryId, setCategoryId] = useState(DEFAULT_FILTERS.categoryId);
  const [sort, setSort] = useState(DEFAULT_FILTERS.sort);
  const [order, setOrder] = useState(DEFAULT_FILTERS.order);
  const [pageByResource, setPageByResource] = useState<Record<string, number>>({});

  // Contextual detail panel (Opsi C) — e.g. Leather Shelf's per-book
  // reviews, Codigram's per-post comments, M-ployee's per-employee
  // dependents. Not every app has one (config.detail is optional).
  const [selectedParentId, setSelectedParentId] = useState<
    string | number | null
  >(null);

  const safeAppId = config ? (appId as string) : "";
  const baseUrl = config?.app.url ?? "";

  const activeResource = useMemo(
    () =>
      resources.find((r) => r.key === activeTab && !r.requiresAuth) ??
      firstOpenResource,
    [resources, activeTab, firstOpenResource],
  );

  const page = pageByResource[activeTab] ?? 1;

  // Only the params this endpoint declares in config are sent — see
  // `params` on each resource in application.config.ts.
  const queryParams = useMemo(
    () =>
      buildResourceParams(activeResource, {
        search,
        categoryId,
        sort,
        order,
        page,
        limit: ITEMS_PER_PAGE,
      }),
    [activeResource, search, categoryId, sort, order, page],
  );

  const hasServerSearch = !!activeResource?.params?.search;
  const categoryFilter = activeResource?.params?.category;

  const resourceQuery = useApplicationResource(
    safeAppId,
    baseUrl,
    activeResource?.endpoint ?? "",
    queryParams,
    { enabled: !!config && !!activeResource && !activeResource.requiresAuth },
  );

  // Category dropdown options — fetched from the resource named in the
  // active resource's `params.category.optionsFrom` (e.g. Categories, or
  // Genres for Leather Shelf books), even if that tab was never opened.
  const categoryOptionsResource = categoryFilter
    ? resources.find((r) => r.key === categoryFilter.optionsFrom)
    : undefined;
  const categoriesQuery = useApplicationResource<{ id: number | string; name: string }>(
    safeAppId,
    baseUrl,
    categoryOptionsResource?.endpoint ?? "",
    undefined,
    { enabled: !!config && !!categoryOptionsResource },
  );

  // Stats — used purely for tab badge counts (see statsKey on each
  // resource). Only fetched for apps that declare a statsEndpoint.
  const statsQuery = useApplicationStats(
    safeAppId,
    baseUrl,
    config?.statsEndpoint,
    { enabled: !!config },
  );

  // Apps without /stats: the paginated main resource still reports its total
  // in `meta.total`, so a one-row request is enough to fill its card.
  const countOnlyResource = resources.find(
    (r) => r.paginated && !r.statsKey && !r.requiresAuth,
  );
  const countOnlyQuery = useApplicationResource(
    safeAppId,
    baseUrl,
    countOnlyResource?.endpoint ?? "",
    COUNT_ONLY_PARAMS,
    { enabled: !!config && !!countOnlyResource },
  );

  const queryClient = useQueryClient();

  const detailConfig = config?.detail;
  const detailEnabled = !!detailConfig && selectedParentId !== null;

  const detailQuery = useApplicationResource<Record<string, unknown>>(
    safeAppId,
    baseUrl,
    detailConfig && selectedParentId !== null
      ? detailConfig.endpoint(selectedParentId)
      : "",
    undefined,
    { enabled: detailEnabled },
  );

  const resetPage = useCallback(() => {
    setPageByResource((prev) => ({ ...prev, [activeTab]: 1 }));
  }, [activeTab]);

  // Filters belong to the tab they were set on — a search typed on Coffees
  // shouldn't silently filter the Categories tab.
  const handleTabChange = useCallback((value: string) => {
    if (resources.find((r) => r.key === value)?.requiresAuth) return;

    setActiveTab(value);
    setSearch(DEFAULT_FILTERS.search);
    setCategoryId(DEFAULT_FILTERS.categoryId);
    setSort(DEFAULT_FILTERS.sort);
    setOrder(DEFAULT_FILTERS.order);
    setPageByResource((prev) => ({ ...prev, [value]: 1 }));
  }, [resources]);

  // Any filter change starts again from page 1, otherwise a search made
  // on page 3 can look empty when the results fit on one page.
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      resetPage();
    },
    [resetPage],
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      setCategoryId(value);
      resetPage();
    },
    [resetPage],
  );

  const handleSortChange = useCallback(
    (value: string) => {
      setSort(value);
      resetPage();
    },
    [resetPage],
  );

  const handleOrderChange = useCallback(
    (value: string) => {
      setOrder(value);
      resetPage();
    },
    [resetPage],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPageByResource((prev) => ({ ...prev, [activeTab]: newPage }));
    },
    [activeTab],
  );

  const handleRowClick = useCallback(
    (row: unknown) => {
      if (!detailConfig) return;

      const id = (row as { id?: string | number })?.id;

      if (id !== undefined) {
        setSelectedParentId(id);
      }
    },
    [detailConfig],
  );

  const rawData = resourceQuery.data?.data ?? NO_ROWS;
  const firstRow = rawData[0] as Record<string, unknown> | undefined;

  // Endpoints without `?search=` get the search applied to the rows that
  // are already loaded, so the search box works on every tab.
  const visibleRows = useMemo(
    () => (hasServerSearch ? rawData : filterRowsBySearch(rawData, search)),
    [hasServerSearch, rawData, search],
  );

  // Every hook must run before the early return below — React requires
  // the same hooks in the same order on every render.
  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (activeResource?.columns) return activeResource.columns;
    if (!firstRow) return [];
    return createAutoColumns(firstRow);
  }, [activeResource, firstRow]);

  if (!config || !activeResource) {
    return <Navigate to={PATHS.APPLICATIONS} replace />;
  }

  const paginatedData = activeResource.paginated
    ? visibleRows
    : visibleRows.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalPages = activeResource.paginated
    ? (resourceQuery.data?.meta?.totalPages ?? 1)
    : Math.ceil(visibleRows.length / ITEMS_PER_PAGE) || 1;

  const isRowClickable =
    !!detailConfig && activeTab === detailConfig.parentResourceKey;

  // Query key of a resource's unfiltered list — the same key its tab (and
  // a category dropdown built from it) uses, so its cache can be read here.
  const listQueryKey = (resource: ResourceConfig) => [
    "resource",
    safeAppId,
    resource.endpoint,
    buildResourceParams(resource, {
      ...DEFAULT_FILTERS,
      page: 1,
      limit: ITEMS_PER_PAGE,
    }),
  ];

  const statCards = buildStatCards(resources, {
    stats: statsQuery.data,
    isStatsLoading: statsQuery.isLoading,
    countOnlyKey: countOnlyResource?.key,
    countOnlyTotal: countOnlyQuery.data?.meta?.total,
    isCountOnlyLoading: countOnlyQuery.isLoading,
    getLoadedRowCount: (resource) =>
      queryClient.getQueryData<{ data: unknown[] }>(listQueryKey(resource))
        ?.data.length,
    // Only queries that exist in the cache (a visited tab, or a category
    // dropdown's options) can be pending; never-opened tabs have no entry.
    isLoadingRows: (resource) =>
      queryClient.getQueryState(listQueryKey(resource))?.status === "pending",
  });

  return (
    <PageContainer>
      <div className="flex gap-6">
        <TabsPrimitive.Root
          value={activeResource.key}
          onValueChange={handleTabChange}
          activationMode="manual"
          className="min-w-0 flex-1 space-y-6"
        >
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <PageHeader
              title={config.app.name}
              description={config.app.description}
              badgeName={config.entityName}
              badgeColor={config.color}
              badgeEmoji={config.emoji}
            />

            <ResourceStatCards cards={statCards} />
          </div>

          <TabsPrimitive.Content
            value={activeResource.key}
            className="space-y-6 rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-blue-500/30"
          >
            <ApplicationFilters
              search={search}
              categoryId={categoryId}
              sort={sort}
              order={order}
              entityPluralName={activeResource.label}
              showCategory={!!categoryFilter}
              showSort={!!activeResource.params?.sort}
              categories={categoriesQuery.data?.data ?? []}
              categoryLabel={categoryOptionsResource?.label}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onSortChange={handleSortChange}
              onOrderChange={handleOrderChange}
            />

            <ResourceTab<any>
              columns={columns}
              data={paginatedData as any[]}
              isLoading={resourceQuery.isLoading}
              isError={resourceQuery.isError}
              onRowClick={isRowClickable ? handleRowClick : undefined}
            />

            <ApplicationPagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </TabsPrimitive.Content>
        </TabsPrimitive.Root>

        {detailConfig && (
          <DetailPanel isOpen={selectedParentId !== null}>
            <DetailPanelHeader
              title={detailConfig.label}
              subtitle={`${detailConfig.parentResourceKey.slice(0, -1) || "Item"} #${selectedParentId ?? ""}`}
              onClose={() => setSelectedParentId(null)}
            />

            <div className="space-y-3 p-4">
              {detailQuery.isLoading && (
                <Loading label={`Loading ${detailConfig.label.toLowerCase()}...`} />
              )}

              {detailQuery.isError && (
                <ErrorState
                  description={`Couldn't load ${detailConfig.label.toLowerCase()} for this item.`}
                />
              )}

              {!detailQuery.isLoading &&
                !detailQuery.isError &&
                (detailQuery.data?.data.length ?? 0) === 0 && (
                  <EmptyState
                    description={`No ${detailConfig.label.toLowerCase()} yet for this item.`}
                  />
                )}

              {(detailQuery.data?.data ?? []).map((item, index) => (
                <div
                  key={(item as { id?: string | number }).id ?? index}
                  className="space-y-1.5 rounded-md border border-slate-200 p-3"
                >
                  {Object.keys(item)
                    .filter((key) => !HIDDEN_FIELDS.has(key))
                    .filter((key) => !Array.isArray((item as any)[key]))
                    .map((key) => (
                      <div
                        key={key}
                        className="flex items-start justify-between gap-3 text-sm"
                      >
                        <span className="shrink-0 font-medium text-slate-500">
                          {humanize(key)}
                        </span>
                        <span className="text-right text-slate-700">
                          {renderValue(key, (item as any)[key])}
                        </span>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </DetailPanel>
        )}
      </div>
    </PageContainer>
  );
}

/**
 * Keyed by appId so React mounts a fresh page per application. Without the
 * key, the same component instance is reused when navigating between apps
 * and the previous app's tab, search, category, sort, page and open detail
 * panel leak into the next one (e.g. Kings Brew's "entities" tab on
 * Codigram, which has no such tab).
 */
function ApplicationPage() {
  const { appId } = useParams<{ appId: string }>();

  return <ApplicationPageContent key={appId} appId={appId} />;
}

export default ApplicationPage;
