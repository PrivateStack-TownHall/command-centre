import { useCallback, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Navigate, useParams } from "react-router-dom";

import PageContainer from "@/components/shared/page/PageContainer";
import PageHeader from "@/components/shared/page/PageHeader";
import EntityTabs from "@/components/shared/entity/EntityTabs";
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
} from "../config/application.config";

import {
  createAutoColumns,
  humanize,
  renderValue,
  HIDDEN_FIELDS,
} from "../columns/createAutoColumns";
import { useApplicationResource } from "../hooks/useApplicationResource";
import { useApplicationStats } from "../hooks/useApplicationStats";
import { getStatValue } from "../api/stats.api";

import ResourceTab from "../tabs/ResourceTab";

const ITEMS_PER_PAGE = 10;

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
function ApplicationPage() {
  const { appId } = useParams<{ appId: string }>();

  const isValidAppId = !!appId && appId in APPLICATION_CONFIG;
  const config = isValidAppId
    ? APPLICATION_CONFIG[appId as ApplicationId]
    : undefined;

  const resources = config?.resources ?? [];

  const [activeTab, setActiveTab] = useState(resources[0]?.key ?? "");

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
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
    () => resources.find((r) => r.key === activeTab) ?? resources[0],
    [resources, activeTab],
  );

  const page = pageByResource[activeTab] ?? 1;

  const queryParams = useMemo(
    () =>
      activeResource?.paginated
        ? { search, categoryId, sort, order, page, limit: ITEMS_PER_PAGE }
        : undefined,
    [activeResource, search, categoryId, sort, order, page],
  );

  const resourceQuery = useApplicationResource(
    safeAppId,
    baseUrl,
    activeResource?.endpoint ?? "",
    queryParams,
    { enabled: !!config && !!activeResource },
  );

  // Category dropdown data — fetched independently of the active tab so
  // it's available on the main (paginated) resource's filter bar even
  // when the Categories tab itself hasn't been opened.
  const categoriesResource = resources.find((r) => r.key === "categories");
  const categoriesQuery = useApplicationResource<{ id: number | string; name: string }>(
    safeAppId,
    baseUrl,
    categoriesResource?.endpoint ?? "",
    undefined,
    { enabled: !!config && !!activeResource?.paginated && !!categoriesResource },
  );

  // /stats — used purely for tab badge counts (see statsKey on each
  // resource). Only fetched for apps confirmed to have this endpoint.
  const statsQuery = useApplicationStats(safeAppId, baseUrl, {
    enabled: !!config?.statsEndpoint,
  });

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

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

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

  if (!config || !activeResource) {
    return <Navigate to={PATHS.APPLICATIONS} replace />;
  }

  const rawData = resourceQuery.data?.data ?? [];

  const paginatedData = activeResource.paginated
    ? rawData
    : rawData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalPages = activeResource.paginated
    ? (resourceQuery.data?.meta?.totalPages ?? 1)
    : Math.ceil(rawData.length / ITEMS_PER_PAGE) || 1;

  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (activeResource.columns) return activeResource.columns;
    if (rawData.length === 0) return [];
    return createAutoColumns(rawData[0] as Record<string, unknown>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeResource, rawData[0]]);

  const isRowClickable =
    !!detailConfig && activeTab === detailConfig.parentResourceKey;

  return (
    <PageContainer>
      <div className="flex gap-6">
        <div className="min-w-0 flex-1 space-y-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <PageHeader
              title={config.app.name}
              description={config.app.description}
              badgeName={config.entityName}
              badgeColor={config.color}
              badgeEmoji={config.emoji}
            />

            {config.statsEndpoint && (
              <ResourceStatCards
                resources={resources}
                getCount={(key) => {
                  const resource = resources.find((r) => r.key === key);
                  return resource?.statsKey
                    ? getStatValue(statsQuery.data, resource.statsKey)
                    : undefined;
                }}
              />
            )}
          </div>

          <EntityTabs
            value={activeTab}
            onValueChange={handleTabChange}
            tabs={resources.map((r) => {
              const statBadge = r.statsKey
                ? getStatValue(statsQuery.data, r.statsKey)
                : undefined;

              return {
                value: r.key,
                label: r.label,
                badge:
                  statBadge ??
                  (r.key === activeTab ? rawData.length : undefined),
              };
            })}
          />

          <ApplicationFilters
            search={search}
            categoryId={categoryId}
            sort={sort}
            order={order}
            entityPluralName={activeResource.label}
            showAdvanced={!!activeResource.paginated}
            categories={categoriesQuery.data?.data ?? []}
            onSearchChange={setSearch}
            onCategoryChange={setCategoryId}
            onSortChange={setSort}
            onOrderChange={setOrder}
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
        </div>

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

export default ApplicationPage;
