import {
  FolderKanban,
  ImageIcon,
  MessageSquareText,
  Package,
  ShoppingCart,
} from "lucide-react";

import type { CommandCentreApplication } from "../types/command-centre.type";

interface ApplicationsOverviewProps {
  applications: CommandCentreApplication[];
}

function ApplicationsOverview({ applications }: ApplicationsOverviewProps) {
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
        <h2 className="text-lg font-semibold">Applications Overview</h2>

        <p className="text-sm text-slate-500">
          Current statistics across all connected applications.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {applications.map((app) => (
          <div
            key={app.id}
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              p-5
              transition-all
              hover:-translate-y-1
              hover:shadow-md
            "
          >
            <div className="mb-5 flex items-center gap-3">
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-slate-100
                  text-2xl
                "
              >
                {app.emoji}
              </div>

              <div>
                <h3 className="font-semibold">{app.name}</h3>

                <p className="text-xs text-slate-500">{app.health.status}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-emerald-600" />
                  Products
                </div>

                <span className="font-semibold">
                  {app.stats.products.total}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-violet-600" />
                  Categories
                </div>

                <span className="font-semibold">
                  {app.stats.categories.total}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-pink-600" />
                  Images
                </div>

                <span className="font-semibold">{app.stats.images.total}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <MessageSquareText className="h-4 w-4 text-orange-600" />
                  Reviews
                </div>

                <span className="font-semibold">{app.stats.reviews.total}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-cyan-600" />
                  Orders
                </div>

                <span className="font-semibold">{app.stats.orders.total}</span>
              </div>
            </div>

            <div className="mt-5 border-t pt-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Database</span>

                <span
                  className={
                    app.monitoring.database.status === "CONNECTED"
                      ? "font-medium text-emerald-600"
                      : "font-medium text-red-600"
                  }
                >
                  {app.monitoring.database.status}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Latency</span>

                <span>{app.monitoring.database.latency} ms</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApplicationsOverview;
