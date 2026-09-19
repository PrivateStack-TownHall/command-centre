import type { UptimeCount } from "../snapshots/snapshot.types";

/** Percentage of checks that answered UP, rounded to one decimal. */
export function uptimePercent(count: UptimeCount | undefined): number | null {
  if (!count || count.total === 0) return null;

  return Math.round((count.up / count.total) * 1000) / 10;
}

/** Average latency of the checks that reported one. */
export function averageLatency(latencies: Array<number | null>): number | null {
  const measured = latencies.filter((value): value is number => value !== null);

  if (measured.length === 0) return null;

  return Math.round(measured.reduce((sum, value) => sum + value, 0) / measured.length);
}
