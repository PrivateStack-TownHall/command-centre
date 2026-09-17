import { useMemo } from "react";

import { ShoppingCart } from "lucide-react";

import Main from "./Main";
import ApplicationPagination from "@/features/applications/components/ApplicationPagination";
import FeedSkeleton from "@/components/shared/filters/FeedSkeleton";
import { ALL_OPTION } from "@/components/shared/filters/FilterSelect";
import type { FeedView } from "@/components/shared/filters/ViewToggle";

import type { AppOrder } from "../types/order.type";

const ITEMS_PER_PAGE = 8;

interface DataProps {
  orders: AppOrder[];
  isLoading?: boolean;
  search: string;
  status: string;
  // dateFrom: string;
  // dateTo: string;
  sort: string;
  view: FeedView;
  page: number;
  onPageChange: (page: number) => void;
}

function Data({
  orders,
  isLoading = false,
  search,
  status,
  // dateFrom,
  // dateTo,
  sort,
  view,
  page,
  onPageChange,
}: DataProps) {
  const filteredOrders = useMemo(() => {
    let result = orders.filter((order) => {
      const matchStatus = status === ALL_OPTION || order.status === status;

      const keyword = search.trim().toLowerCase();

      const matchSearch =
        keyword === "" ||
        order.orderNumber.toLowerCase().includes(keyword) ||
        order.user.fullName.toLowerCase().includes(keyword);

      // const orderDate = new Date(order.createdAt).getTime();

      // const matchFrom = !dateFrom || orderDate >= new Date(dateFrom).getTime();
      // const matchTo =
      //   !dateTo || orderDate <= new Date(dateTo).getTime() + 86400000 - 1;

      return matchStatus && matchSearch;
    });

    result = [...result];

    if (sort === "latest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sort === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    } else if (sort === "highest") {
      result.sort((a, b) => Number(b.totalAmount) - Number(a.totalAmount));
    } else if (sort === "lowest") {
      result.sort((a, b) => Number(a.totalAmount) - Number(b.totalAmount));
    }

    return result;
  }, [orders, search, status, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ITEMS_PER_PAGE),
  );
  const safePage = Math.min(page, totalPages);

  const paginatedOrders = filteredOrders.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <ShoppingCart className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">Orders</h3>
          <p className="text-xs text-slate-500">
            {isLoading ? (
              "Loading orders..."
            ) : (
              <>
                Showing{" "}
                {filteredOrders.length === 0
                  ? 0
                  : (safePage - 1) * ITEMS_PER_PAGE + 1}
                –{Math.min(safePage * ITEMS_PER_PAGE, filteredOrders.length)} of{" "}
                {filteredOrders.length} orders
              </>
            )}
          </p>
        </div>
      </div>

      {isLoading ? (
        <FeedSkeleton view={view} />
      ) : (
        <>
          <Main orders={paginatedOrders} view={view} />

          <ApplicationPagination
            page={safePage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
}

export default Data;
