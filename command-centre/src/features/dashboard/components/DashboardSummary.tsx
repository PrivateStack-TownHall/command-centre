import {
  Boxes,
  FolderKanban,
  ImageIcon,
  MessageSquareText,
  Package,
  ShoppingCart,
} from "lucide-react";

import type { CommandCentreApplication } from "../types/command-centre.type";

interface DashboardSummaryProps {
  applications: CommandCentreApplication[];
}

function DashboardSummary({ applications }: DashboardSummaryProps) {
  const summary = {
    totalApplications: applications.length,

    totalProducts: applications.reduce(
      (sum, app) => sum + (app.stats?.products.total ?? 0),
      0,
    ),

    totalCategories: applications.reduce(
      (sum, app) => sum + (app.stats?.categories.total ?? 0),
      0,
    ),

    totalImages: applications.reduce(
      (sum, app) => sum + (app.stats?.images.total ?? 0),
      0,
    ),

    totalReviews: applications.reduce(
      (sum, app) => sum + (app.stats?.reviews.total ?? 0),
      0,
    ),

    totalOrders: applications.reduce(
      (sum, app) => sum + (app.stats?.orders.total ?? 0),
      0,
    ),
  };

  const items = [
    {
      label: "Applications",
      value: summary.totalApplications,
      icon: Boxes,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Products",
      value: summary.totalProducts,
      icon: Package,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Categories",
      value: summary.totalCategories,
      icon: FolderKanban,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Images",
      value: summary.totalImages,
      icon: ImageIcon,
      color: "bg-pink-50 text-pink-600",
    },
    {
      label: "Reviews",
      value: summary.totalReviews,
      icon: MessageSquareText,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Orders",
      value: summary.totalOrders,
      icon: ShoppingCart,
      color: "bg-cyan-50 text-cyan-600",
    },
  ];

  return (
    <div
      className="
        rounded-xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
      "
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Ecosystem Summary</h2>

        <p className="text-sm text-slate-500">
          Aggregated information across all connected applications.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="
                flex
                items-center
                gap-4
                rounded-xl
                border
                border-slate-100
                p-4
              "
            >
              <div
                className={`
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  ${item.color}
                `}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-slate-500">{item.label}</p>

                <h3 className="text-2xl font-bold">
                  {item.value.toLocaleString()}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DashboardSummary;
