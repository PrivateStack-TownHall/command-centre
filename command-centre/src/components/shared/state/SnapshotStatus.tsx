import { AlertCircle, Clock3, Loader2 } from "lucide-react";

interface SnapshotApplication {
  name: string;
  emoji: string;
  refreshing: boolean;
  errors?: Record<string, string>;
  error?: string | null;
}

interface SnapshotStatusProps {
  /** When the BFF answered, i.e. `generatedAt`. */
  generatedAt?: string;
  /** Age of the oldest application snapshot, in seconds. */
  oldestAgeSeconds?: number;
  applications: SnapshotApplication[];
}

function relative(seconds: number): string {
  if (seconds < 60) return "just now";

  const minutes = Math.round(seconds / 60);

  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.round(minutes / 60);

  return `${hours} hour${hours === 1 ? "" : "s"} ago`;
}

const names = (applications: SnapshotApplication[]) =>
  applications.map((app) => `${app.emoji} ${app.name}`).join(", ");

/**
 * One line under the page header saying how old the data is, which
 * applications are still being refreshed, and which ones reported errors.
 * The BFF serves stored snapshots, so this keeps "a few minutes old" visible
 * instead of looking live.
 */
function SnapshotStatus({
  generatedAt,
  oldestAgeSeconds,
  applications,
}: SnapshotStatusProps) {
  const refreshing = applications.filter((app) => app.refreshing);
  const failed = applications.filter(
    (app) => app.error || Object.keys(app.errors ?? {}).length > 0,
  );

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
      <p className="flex items-center gap-2">
        <Clock3 aria-hidden className="h-4 w-4 text-slate-400" />
        {oldestAgeSeconds === undefined
          ? "Waiting for the first snapshot"
          : `Updated ${relative(oldestAgeSeconds)}`}
        {generatedAt && (
          <span className="text-slate-400">
            · served {new Date(generatedAt).toLocaleTimeString()}
          </span>
        )}
      </p>

      {refreshing.length > 0 && (
        <p className="flex items-center gap-2">
          <Loader2 aria-hidden className="h-4 w-4 animate-spin text-blue-600" />
          Refreshing {names(refreshing)}
        </p>
      )}

      {failed.length > 0 && (
        <p className="flex items-center gap-2">
          <AlertCircle aria-hidden className="h-4 w-4 text-red-600" />
          Last refresh failed for {names(failed)}
        </p>
      )}
    </div>
  );
}

export default SnapshotStatus;
