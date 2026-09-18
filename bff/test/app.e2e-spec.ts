/**
 * End-to-end: the real AppModule against a real PostgreSQL database and fake
 * backends served locally. Needs E2E_DATABASE_URL, e.g.
 *   E2E_DATABASE_URL=postgres://postgres:postgres@localhost:5432/command_centre_bff_test npm run test:e2e
 * The database's app_snapshots table is emptied before the run.
 */
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import { UpstreamHttpClient } from "../src/common/http/upstream-http.client";
import { PrismaService } from "../src/prisma/prisma.service";
import { SnapshotsRepository } from "../src/snapshots/snapshots.repository";
import { SnapshotsService } from "../src/snapshots/snapshots.service";

const DATABASE_URL = process.env.E2E_DATABASE_URL;
const describeWithDb = DATABASE_URL ? describe : describe.skip;

type Routes = Record<string, { status?: number; body?: unknown }>;

function fakeBackend(routes: Routes): Promise<{ server: Server; url: string }> {
  const server = createServer((req, res) => {
    const route = routes[req.url ?? ""] ?? {
      status: 404,
      body: { success: false },
    };
    res.writeHead(route.status ?? 200, { "content-type": "application/json" });
    res.end(JSON.stringify(route.body ?? {}));
  });

  return new Promise((resolve) =>
    server.listen(0, () =>
      resolve({
        server,
        url: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
      }),
    ),
  );
}

describeWithDb("Command Centre BFF (e2e)", () => {
  let app: INestApplication;
  let backends: Server[] = [];

  beforeAll(async () => {
    const kingsBrew = await fakeBackend({
      "/health": {
        body: {
          success: true,
          status: "UP",
          database: "CONNECTED",
          version: "1.0.0",
          uptime: 7384,
        },
      },
      "/stats": {
        body: {
          success: true,
          products: { total: 42 },
          reviews: { total: 2, averageRating: 4 },
        },
      },
      "/reviews": {
        body: {
          success: true,
          data: [
            {
              id: 1,
              productId: 1,
              rating: 5,
              comment: "Great",
              createdAt: "2026-06-02T00:00:00Z",
              product: { name: "Espresso" },
            },
            {
              id: 2,
              productId: 2,
              rating: 3,
              comment: null,
              createdAt: "2026-06-01T00:00:00Z",
            },
          ],
        },
      },
      "/public/orders": {
        body: {
          success: true,
          data: [
            {
              id: 7,
              orderNumber: "KB-7",
              status: "PENDING",
              totalAmount: "25000",
              createdAt: "2026-06-03T00:00:00Z",
              items: [{}],
            },
          ],
        },
      },
    });
    const castleKitchen = await fakeBackend({
      "/": { body: { success: true, message: "Castle Kitchen API" } },
      "/reviews": {
        body: {
          success: true,
          data: [
            {
              id: 1,
              productId: 1,
              rating: 4,
              createdAt: "2026-06-04T00:00:00Z",
            },
          ],
        },
      },
    });
    const byteBurger = await fakeBackend({
      "/": { status: 503 },
      "/reviews": { status: 503 },
    });
    backends = [kingsBrew.server, castleKitchen.server, byteBurger.server];

    Object.assign(process.env, {
      DATABASE_URL,
      FRONTEND_ORIGIN: "http://localhost:5000",
      KINGS_BREW_URL: kingsBrew.url,
      CASTLE_KITCHEN_URL: castleKitchen.url,
      BYTE_BURGER_URL: byteBurger.url,
    });

    // Import after the env is set: ConfigModule validates on import.
    const { AppModule } = await import("../src/app.module");
    const { setupApp } = await import("../src/setup-app");

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    setupApp(app);
    await app.init();

    // Retries without real waiting.
    app.get(UpstreamHttpClient).sleep = async () => undefined;

    await app
      .get(PrismaService)
      .$executeRawUnsafe(
        "TRUNCATE app_snapshots, health_checks RESTART IDENTITY CASCADE",
      );
  });

  afterAll(async () => {
    await app?.close();
    await Promise.all(
      backends.map((server) => new Promise((resolve) => server.close(resolve))),
    );
  });

  const byId = (items: Array<{ id: string }>, id: string) =>
    items.find((item) => item.id === id) as any;

  it("GET /health reports the BFF and its database", async () => {
    const response = await request(app.getHttpServer())
      .get("/health")
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      data: { status: "UP", database: "CONNECTED" },
    });
  });

  it("GET /dashboard answers at once, then serves stored snapshots", async () => {
    const first = await request(app.getHttpServer())
      .get("/dashboard")
      .expect(200);
    const firstApps = first.body.data.applications;

    expect(firstApps).toHaveLength(12);
    expect(byId(firstApps, "kings-brew")).toMatchObject({
      freshness: "missing",
      refreshing: true,
    });
    expect(byId(firstApps, "nomad")).toMatchObject({
      freshness: "not-deployed",
    });

    await app.get(SnapshotsService).waitForRefreshes();

    const second = await request(app.getHttpServer())
      .get("/dashboard")
      .expect(200);
    const { summary, latestReviews, latestOrders, applications } =
      second.body.data;

    expect(byId(applications, "kings-brew")).toMatchObject({
      freshness: "fresh",
      health: { status: "UP", uptimeSeconds: 7384 },
      stats: { products: { total: 42 } },
      orders: { total: 1, byStatus: { PENDING: 1 }, totalAmount: 25000 },
    });
    expect(byId(applications, "castle-kitchen")).toMatchObject({
      health: { status: "UP" },
      stats: null,
    });
    expect(byId(applications, "byte-burger")).toMatchObject({
      health: { status: "DOWN", reachable: false },
      errors: { health: "HTTP 503", reviews: "HTTP 503" },
    });

    expect(summary).toMatchObject({
      deployed: 3,
      online: 2,
      offline: 1,
      reviews: { total: 3 },
    });
    expect(
      latestReviews.map((review: { appId: string }) => review.appId),
    ).toEqual(["castle-kitchen", "kings-brew", "kings-brew"]);
    expect(latestOrders[0]).toMatchObject({
      orderNumber: "KB-7",
      appEmoji: "☕",
    });
  });

  it("GET /monitoring reads the same snapshots", async () => {
    const response = await request(app.getHttpServer())
      .get("/monitoring")
      .expect(200);

    // Only three backends have a URL in this test; the other nine are "not deployed".
    expect(response.body.data.summary).toEqual({
      total: 12,
      online: 2,
      offline: 1,
      unknown: 0,
      notDeployed: 9,
    });

    // Uptime comes from the health_checks table written during the refresh.
    const kingsBrew = byId(response.body.data.applications, "kings-brew");
    expect(kingsBrew).toMatchObject({ uptimePercent: 100, checksCounted: 1 });
  });

  it("GET /monitoring/history returns the stored checks of one application", async () => {
    const response = await request(app.getHttpServer())
      .get("/monitoring/history?appId=kings-brew&hours=24")
      .expect(200);

    const { uptimePercent, averageLatencyMs, checks } = response.body.data;

    expect(checks.length).toBeGreaterThan(0);
    expect(checks[0]).toMatchObject({ status: "UP", reachable: true });
    expect(uptimePercent).toBe(100);
    expect(typeof averageLatencyMs).toBe("number");
  });

  it("GET /monitoring/history explains a missing appId", async () => {
    const response = await request(app.getHttpServer())
      .get("/monitoring/history")
      .expect(400);

    expect(response.body.message).toContain("appId");
    expect(response.body.message).not.toContain("undefined");
  });

  it("GET /monitoring/history rejects an out-of-range hours", async () => {
    await request(app.getHttpServer())
      .get("/monitoring/history?appId=kings-brew&hours=0")
      .expect(400);
  });

  it("GET /monitoring/history rejects an unknown application", async () => {
    const response = await request(app.getHttpServer())
      .get("/monitoring/history?appId=nope")
      .expect(404);

    expect(response.body).toMatchObject({ success: false, statusCode: 404 });
  });

  it("the PostgreSQL lock lets only one of many concurrent refreshes start", async () => {
    const repository = app.get(SnapshotsRepository);

    await repository.releaseRefreshLock("kings-brew");
    const results = await Promise.all(
      Array.from({ length: 10 }, () =>
        repository.tryAcquireRefreshLock("kings-brew", 300),
      ),
    );
    await repository.releaseRefreshLock("kings-brew");

    expect(results.filter(Boolean)).toHaveLength(1);
  });

  it("POST /snapshots/refresh is rate-limited per application", async () => {
    const response = await request(app.getHttpServer())
      .post("/snapshots/refresh?appId=kings-brew")
      .expect(202);

    expect(response.body.data).toEqual([
      { appId: "kings-brew", accepted: false, reason: "too-recent" },
    ]);
  });
});
