export type HealthState = "online" | "waking" | "offline" | "not-deployed";

export interface HealthRow {
  id: string;
  name: string;
  emoji: string;
  state: HealthState;
  latencyMs?: number;
  uptimeSeconds?: number;
}

export interface HealthQueryLike {
  isPending: boolean;
  isError: boolean;
  data?: { status: "UP" | "DOWN"; latencyMs: number; body: Record<string, unknown> };
}

/** Turns one application's health query into a table row. `query` is
 *  undefined when the app has no backend URL or health endpoint yet. */
export function toHealthRow(
  app: { id: string; name: string; emoji: string },
  query: HealthQueryLike | undefined,
): HealthRow {
  if (!query) return { ...app, state: "not-deployed" };

  if (query.data) {
    const uptime = query.data.body.uptime;

    return {
      ...app,
      state: query.data.status === "UP" ? "online" : "offline",
      latencyMs: query.data.latencyMs,
      uptimeSeconds: typeof uptime === "number" ? uptime : undefined,
    };
  }

  return { ...app, state: query.isError ? "offline" : "waking" };
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
