import { Clock3 } from "lucide-react";

import type { CommandCentreApplication } from "../types/command-centre.type";

interface LatestUpdatesProps {
  applications: CommandCentreApplication[];
}

function LatestUpdates({ applications }: LatestUpdatesProps) {
  const updates = applications
    .flatMap((app) =>
      app.activities.map((activity) => ({
        ...activity,
        emoji: app.emoji,
      })),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Clock3 className="h-5 w-5 text-primary" />

        <div>
          <h2 className="font-semibold">Latest Updates</h2>

          <p className="text-sm text-slate-500">
            Recent activities across all applications.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {updates.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{item.emoji}</div>

              <div>
                <h3 className="font-medium">{item.title}</h3>

                <p className="text-sm text-slate-500">
                  {item.application} • {item.entity}
                </p>

                <p className="text-xs text-slate-400">{item.description}</p>
              </div>
            </div>

            <span className="text-xs text-slate-400">
              {new Date(item.createdAt).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LatestUpdates;
