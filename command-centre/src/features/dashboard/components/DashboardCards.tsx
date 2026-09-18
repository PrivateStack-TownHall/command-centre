import {
  Boxes,
  FolderKanban,
  ImageIcon,
  MessageSquareText,
  Package,
  ShoppingCart,
} from "lucide-react";

import type { CommandCentreApplication } from "../types/command-centre.type";

interface DashboardCardsProps {
  applications: CommandCentreApplication[];
}

function DashboardCards({ applications }: DashboardCardsProps) {
  const totalApplications = applications.length;

  const totalProducts = applications.reduce(
    (sum, app) => sum + (app.stats?.products.total ?? 0),
    0,
  );

  const totalCategories = applications.reduce(
    (sum, app) => sum + (app.stats?.categories.total ?? 0),
    0,
  );

  const totalImages = applications.reduce(
    (sum, app) => sum + (app.stats?.images.total ?? 0),
    0,
  );

  const totalReviews = applications.reduce(
    (sum, app) => sum + (app.stats?.reviews.total ?? 0),
    0,
  );

  const totalOrders = applications.reduce(
    (sum, app) => sum + (app.stats?.orders.total ?? 0),
    0,
  );

  const cards = [
    {
      label: "Applications",
      value: totalApplications,
      icon: Boxes,
      color: "bg-blue-50 text-blue-600",
    },

    {
      label: "Products",
      value: totalProducts,
      icon: Package,
      color: "bg-emerald-50 text-emerald-600",
    },

    {
      label: "Categories",
      value: totalCategories,
      icon: FolderKanban,
      color: "bg-violet-50 text-violet-600",
    },

    {
      label: "Images",
      value: totalImages,
      icon: ImageIcon,
      color: "bg-pink-50 text-pink-600",
    },

    {
      label: "Reviews",
      value: totalReviews,
      icon: MessageSquareText,
      color: "bg-orange-50 text-orange-600",
    },

    {
      label: "Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "bg-cyan-50 text-cyan-600",
    },
  ];

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3
        xl:grid-cols-6
      "
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              shadow-sm
              transition-all
              hover:shadow-md
            "
          >
            <div
              className={`
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-xl
                ${card.color}
              `}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p
                className="
                  truncate
                  text-xs
                  font-medium
                  uppercase
                  tracking-wide
                  text-slate-500
                "
              >
                {card.label}
              </p>

              <h3
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                "
              >
                {card.value.toLocaleString()}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardCards;
