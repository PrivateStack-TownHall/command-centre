import type { BffMonitoringApplication } from "@/features/bff/types/bff.type";

export type HealthState = "online" | "waking" | "offline" | "not-deployed";

export interface HealthRow {
  id: string;
  name: string;
  emoji: string;
  state: HealthState;
  latencyMs?: number;
  uptimeSeconds?: number;
  /** Share of successful checks over the BFF's uptime window. */
  uptimePercent?: number;
}

/**
 * Turns one application of the BFF's /monitoring response into a table row.
 * The BFF has no "waking" state: an application whose first snapshot is
 * still being fetched is exactly what the table shows as waking up.
 */
export function toHealthRow(app: BffMonitoringApplication): HealthRow {
  return {
    id: app.id,
    name: app.name,
    emoji: app.emoji,
    state: healthState(app),
    latencyMs: app.health?.latencyMs ?? undefined,
    uptimeSeconds: app.health?.uptimeSeconds ?? undefined,
    uptimePercent: app.uptimePercent ?? undefined,
  };
}

function healthState(app: BffMonitoringApplication): HealthState {
  if (app.state === "not-deployed") return "not-deployed";
  if (app.state === "online") return "online";
  if (app.state === "offline") return "offline";

  // "unknown": never checked yet, so it's either waking or about to be.
  return "waking";
}

export function summarizeHealth(rows: HealthRow[]) {
  const count = (state: HealthState) =>
    rows.filter((row) => row.state === state).length;

  return {
    total: rows.length,
    online: count("online"),
    waking: count("waking"),
    offline: count("offline"),
  };
}
