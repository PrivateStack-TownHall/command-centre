import { ConfigService } from "@nestjs/config";

import { resolveApplications } from "../config/applications.config";
import type { ApplicationSourceService, CollectResult } from "../sources/application-source.service";

import { InMemorySnapshotsRepository } from "./in-memory-snapshots.repository";
import { emptySnapshotData, type AppSnapshotData } from "./snapshot.types";
import { SnapshotsService } from "./snapshots.service";

const ENV = {
  SNAPSHOT_TTL_SECONDS: 300,
  REFRESH_LOCK_SECONDS: 300,
  MANUAL_REFRESH_MIN_SECONDS: 30,
  LATEST_ITEMS_LIMIT: 5,
  HEALTH_HISTORY_RETENTION_DAYS: 7,
  UPTIME_WINDOW_HOURS: 24,
};

function setup(collect: (previous: AppSnapshotData) => Promise<CollectResult>) {
  let now = new Date("2026-09-17T09:00:00Z");
  const clock = () => now;
  const repository = new InMemorySnapshotsRepository(clock);
  const calls: string[] = [];

  const source = {
    collect: async (app: { id: string }, previous: AppSnapshotData) => {
      calls.push(app.id);
      return collect(previous);
    },
  } as unknown as ApplicationSourceService;

  // Only Kings Brew is "deployed"; Nomad is a template with no URL.
  const applications = resolveApplications({ KINGS_BREW_URL: "https://kings-brew.test" }).filter(
    (app) => app.id === "kings-brew" || app.id === "nomad",
  );

  const service = new SnapshotsService(
    repository,
    source,
    { get: (key: keyof typeof ENV) => ENV[key] } as unknown as ConfigService<never, true>,
    applications,
    clock,
  );

  return {
    service,
    repository,
    calls,
    advance: (seconds: number) => (now = new Date(now.getTime() + seconds * 1000)),
  };
}

const upData = (): CollectResult => ({
  data: {
    ...emptySnapshotData(),
    health: { status: "UP", reachable: true, latencyMs: 120, database: "CONNECTED", version: "1.0.0", uptimeSeconds: 10 },
    stats: { products: { total: 42 } },
  },
  errors: {},
});

const byId = <T extends { id: string }>(items: T[], id: string) => items.find((item) => item.id === id)!;

describe("SnapshotsService", () => {
  it("answers straight away and fills a missing snapshot in the background", async () => {
    const { service, calls } = setup(async () => upData());

    const first = await service.getSnapshots();
    expect(byId(first, "kings-brew")).toMatchObject({ freshness: "missing", refreshing: true, health: null });
    expect(byId(first, "nomad")).toMatchObject({ freshness: "not-deployed", deployed: false });

    await service.waitForRefreshes();

    const second = await service.getSnapshots();
    expect(byId(second, "kings-brew")).toMatchObject({ freshness: "fresh", refreshing: false });
    expect(byId(second, "kings-brew").stats).toEqual({ products: { total: 42 } });
    expect(calls).toEqual(["kings-brew"]);
  });

  it("serves a stale snapshot while refreshing it in the background", async () => {
    const { service, calls, advance } = setup(async () => upData());

    await service.getSnapshots();
    await service.waitForRefreshes();
    advance(301);

    const stale = await service.getSnapshots();
    expect(byId(stale, "kings-brew")).toMatchObject({ freshness: "stale", refreshing: true });
    expect(byId(stale, "kings-brew").stats).toEqual({ products: { total: 42 } });

    await service.waitForRefreshes();
    expect(calls).toHaveLength(2);
  });

  it("starts only one refresh per app however many requests arrive", async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    const { service, calls } = setup(async () => {
      await gate;
      return upData();
    });

    await Promise.all([service.getSnapshots(), service.getSnapshots(), service.getSnapshots()]);
    release();
    await service.waitForRefreshes();

    expect(calls).toEqual(["kings-brew"]);
  });

  it("keeps the previous section when the backend fails, and records why", async () => {
    let fail = false;
    const { service, advance } = setup(async (previous) =>
      fail ? { data: previous, errors: { stats: "HTTP 503" } } : upData(),
    );

    await service.getSnapshots();
    await service.waitForRefreshes();
    fail = true;
    advance(301);
    await service.getSnapshots();
    await service.waitForRefreshes();

    const view = byId(await service.getSnapshots(), "kings-brew");
    expect(view.stats).toEqual({ products: { total: 42 } });
    expect(view.errors).toEqual({ stats: "HTTP 503" });
  });

  it("rate-limits manual refreshes", async () => {
    const { service, advance } = setup(async () => upData());

    await service.getSnapshots();
    await service.waitForRefreshes();

    expect(await service.requestRefresh("kings-brew")).toEqual([
      { appId: "kings-brew", accepted: false, reason: "too-recent" },
    ]);

    advance(31);
    expect(await service.requestRefresh("kings-brew")).toEqual([{ appId: "kings-brew", accepted: true }]);
    await service.waitForRefreshes();

    expect(await service.requestRefresh("nomad")).toEqual([
      { appId: "nomad", accepted: false, reason: "not-deployed" },
    ]);
    expect(await service.requestRefresh("nope")).toEqual([
      { appId: "nope", accepted: false, reason: "unknown-application" },
    ]);
  });
});

describe("SnapshotsService health history", () => {
  it("records one health check per refresh", async () => {
    const { service, repository, advance } = setup(async () => upData());

    await service.getSnapshots();
    await service.waitForRefreshes();
    advance(301);
    await service.getSnapshots();
    await service.waitForRefreshes();

    expect(repository.healthChecks).toHaveLength(2);
    expect(repository.healthChecks[0]).toMatchObject({
      appId: "kings-brew",
      status: "UP",
      reachable: true,
      latencyMs: 120,
    });
  });

  it("deletes history older than the retention window, at most once an hour", async () => {
    const { service, repository, advance } = setup(async () => upData());

    await service.getSnapshots();
    await service.waitForRefreshes();

    // A check from 10 days ago: older than HEALTH_HISTORY_RETENTION_DAYS (7).
    repository.healthChecks.unshift({
      appId: "kings-brew",
      status: "DOWN",
      reachable: false,
      latencyMs: null,
      checkedAt: new Date("2026-09-07T09:00:00Z"),
    });

    advance(3601);
    await service.getSnapshots();
    await service.waitForRefreshes();

    expect(repository.healthChecks.every((check) => check.status === "UP")).toBe(true);
  });
});
