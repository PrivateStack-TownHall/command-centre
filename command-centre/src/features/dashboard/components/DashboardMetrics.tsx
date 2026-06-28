import { Activity, Clock3, Database, Server } from "lucide-react";

import type { CommandCentreApplication } from "../types/command-centre.type";

interface DashboardMetricsProps {
  applications: CommandCentreApplication[];
}

function DashboardMetrics({ applications }: DashboardMetricsProps) {
  const healthyApps = applications.filter(
    (app) =>
      app.health?.status === "UP" &&
      app.monitoring?.database.status === "CONNECTED",
  ).length;

  const averageLatency =
    applications.length > 0
      ? Math.round(
          applications.reduce(
            (sum, app) => sum + (app.monitoring?.database.latency ?? 0),
            0,
          ) / applications.length,
        )
      : 0;

  const latestSync = applications
    .map((app) => app.monitoring?.response.generatedAt)
    .filter(Boolean)
    .sort()
    .reverse()[0];

  const metrics = [
    {
      title: "Last Sync",
      value: latestSync
        ? new Date(latestSync).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
      icon: Clock3,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Healthy Apps",
      value: `${healthyApps} / ${applications.length}`,
      icon: Activity,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Database",
      value: `${averageLatency} ms`,
      icon: Database,
      color: "text-violet-600 bg-violet-50",
    },
    {
      title: "Node Version",
      value: applications[0]?.monitoring?.node.version ?? "-",
      icon: Server,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.title}
            className="
              flex
              items-center
              gap-4
              rounded-xl
              border
              border-slate-200
              bg-white
              p-4
              shadow-sm
            "
          >
            <div
              className={`
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                ${metric.color}
              `}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-slate-500">{metric.title}</p>

              <h3 className="text-xl font-bold">{metric.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardMetrics;
