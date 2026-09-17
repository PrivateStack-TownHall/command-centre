import { Skeleton } from "@/components/ui/skeleton";

// Skeleton's default `bg-accent` isn't defined in this project's theme,
// so every placeholder sets its colour explicitly.

import type { FeedView } from "./ViewToggle";

/** Grid used by every card feed (Reviews, Orders). */
export const FEED_GRID_CLASS = "grid gap-4 sm:grid-cols-2 xl:grid-cols-4";

interface FeedSkeletonProps {
  view: FeedView;
  count?: number;
}

/** Placeholder shown in place of a card feed while its data loads. */
function FeedSkeleton({ view, count = 8 }: FeedSkeletonProps) {
  const items = Array.from({ length: count });

  if (view === "list") {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading">
        {items.map((_, index) => (
          <Skeleton key={index} className="h-[88px] w-full rounded-xl bg-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <div className={FEED_GRID_CLASS} aria-busy="true" aria-label="Loading">
      {items.map((_, index) => (
        <Skeleton key={index} className="h-56 w-full rounded-xl bg-slate-200" />
      ))}
    </div>
  );
}

export default FeedSkeleton;

/** Placeholder for a page's header stats row while data loads. */
export function StatsSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-6" aria-hidden>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-9 rounded-lg bg-slate-200" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-10 bg-slate-200" />
            <Skeleton className="h-3 w-16 bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
