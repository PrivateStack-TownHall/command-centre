import { summarizeHealth, toHealthRow } from "../health-rows";
import type { BffMonitoringApplication } from "@/features/bff/types/bff.type";

const app = (
  overrides: Partial<BffMonitoringApplication> = {},
): BffMonitoringApplication => ({
  id: "kings-brew",
  name: "Kings Brew",
  emoji: "☕",
  group: "commerce-core",
  state: "online",
  health: {
    status: "UP",
    reachable: true,
    latencyMs: 180,
    database: "CONNECTED",
    version: "1.0.0",
    uptimeSeconds: 3600,
  },
  uptimePercent: 99.5,
  checksCounted: 12,
  freshness: "fresh",
  refreshing: false,
  fetchedAt: "2026-09-17T09:00:00.000Z",
  ageSeconds: 30,
  error: null,
  ...overrides,
});

describe("toHealthRow", () => {
  it("keeps latency, uptime and the uptime percentage of an online app", () => {
    expect(toHealthRow(app())).toEqual({
      id: "kings-brew",
      name: "Kings Brew",
      emoji: "☕",
      state: "online",
      latencyMs: 180,
      uptimeSeconds: 3600,
      uptimePercent: 99.5,
    });
  });

  it("maps an app that has never been checked to waking", () => {
    const row = toHealthRow(
      app({ state: "unknown", health: null, freshness: "missing", refreshing: true }),
    );

    expect(row).toMatchObject({ state: "waking", latencyMs: undefined });
  });

  it("maps offline and not-deployed straight through", () => {
    expect(toHealthRow(app({ state: "offline" })).state).toBe("offline");
    expect(toHealthRow(app({ state: "not-deployed" })).state).toBe("not-deployed");
  });
});

describe("summarizeHealth", () => {
  it("counts each state", () => {
    const rows = [
      toHealthRow(app()),
      toHealthRow(app()),
      toHealthRow(app({ state: "unknown" })),
      toHealthRow(app({ state: "offline" })),
      toHealthRow(app({ state: "not-deployed" })),
    ];

    expect(summarizeHealth(rows)).toEqual({ total: 5, online: 2, waking: 1, offline: 1 });
  });
});
