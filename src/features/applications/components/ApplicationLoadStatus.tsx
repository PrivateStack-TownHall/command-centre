import { AlertCircle, Loader2, RotateCw } from "lucide-react";

import type { ApplicationLoadStatus as Status } from "../hooks/usePublicFeatureData";

interface ApplicationLoadStatusProps {
  statuses: Status[];
  onRetry: () => void;
}

function names(statuses: Status[]) {
  return statuses.map((app) => `${app.emoji} ${app.name}`).join(", ");
}

/**
 * Says which applications are still waking up or couldn't be reached, so
 * a slow backend reads as "still coming" instead of "no data".
 * Renders nothing once every application has answered.
 */
function ApplicationLoadStatus({ statuses, onRetry }: ApplicationLoadStatusProps) {
  const waking = statuses.filter((app) => app.state === "loading");
  const failed = statuses.filter((app) => app.state === "error");

  if (waking.length === 0 && failed.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm" role="status">
      {waking.length > 0 && (
        <p className="flex items-center gap-2 text-slate-600">
          <Loader2 aria-hidden className="h-4 w-4 animate-spin text-blue-600" />
          <span>
            Waking up {names(waking)}. Sleeping servers can take up to a minute.
          </span>
        </p>
      )}

      {failed.length > 0 && (
        <p className="flex items-center gap-2 text-slate-600">
          <AlertCircle aria-hidden className="h-4 w-4 text-red-600" />
          <span>Couldn't reach {names(failed)}.</span>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-medium text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-blue-500/30"
          >
            <RotateCw aria-hidden className="h-3.5 w-3.5" />
            Retry
          </button>
        </p>
      )}
    </div>
  );
}

export default ApplicationLoadStatus;
