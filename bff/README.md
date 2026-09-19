# Command Centre BFF

Aggregation service for the Entrepreneur Topics Ecosystem's 12 backends. It
stores a summary of each backend as a **snapshot in PostgreSQL** and serves it
in milliseconds, even while the backends are asleep on Render.

## Why

The backends run on Render's free tier: they sleep when idle and take up to a
minute to wake. Calling all 12 on every request means waiting on the slowest
one. This service instead:

1. **answers from the last stored snapshot** of each application, immediately;
2. **refreshes stale snapshots in the background** (stale-while-revalidate);
3. **only wakes backends when its endpoints are called** — no cron, no keep-warm.

```
Client ──► BFF ──► PostgreSQL: read snapshots ──► respond (milliseconds)
              │
              └─► snapshot older than SNAPSHOT_TTL_SECONDS?
                     refresh in background ──► backends (with retry)
                     ──► store new snapshot
```

## Endpoints

All responses use the ecosystem's envelope: `{ success: true, data }`, and
errors `{ success: false, statusCode, message }`. Interactive docs at **`/docs`**.

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/dashboard` | Every application's snapshot, a summary, and the latest reviews/orders across apps |
| GET | `/monitoring` | Health of every application: `online`, `offline`, `unknown`, `not-deployed`, plus uptime |
| GET | `/monitoring/history?appId=&hours=` | Stored health checks of one application, for an uptime or latency chart |
| POST | `/snapshots/refresh?appId=` | Start a refresh now (all apps, or one). Rate-limited per app |
| GET | `/health` | The service's own status and database connection |

Each application in `/dashboard` and `/monitoring` carries:

| Field | Meaning |
| ----- | ------- |
| `freshness` | `fresh`, `stale` (served while refreshing), `missing` (first refresh running), `not-deployed` |
| `refreshing` | A refresh is running — request again shortly for newer data |
| `fetchedAt`, `ageSeconds` | When the snapshot was taken and how old it is |
| `errors` | Sections that failed last refresh, e.g. `{ "stats": "HTTP 503" }`. Their previous values are kept |

## Database

Two tables, defined in `prisma/schema.prisma`:

| Table | Rows | Holds |
| ----- | ---- | ----- |
| `app_snapshots` | one per application (12) | The latest summary, the errors of its last refresh, and the refresh lock |
| `health_checks` | one per check, pruned by retention | Status, reachability and latency over time, for uptime history |

`app_snapshots.data` keeps summaries only, never whole tables:

- `health` — UP/DOWN, reachable, latency, database, version, uptime
- `stats` — the app's `/stats` counts (apps that have it)
- `reviews` — total, average rating over every review, latest N
- `orders` — total, count per status, total amount, latest N

Which endpoints each application exposes is declared in
`src/config/applications.config.ts` (confirmed against each backend's Swagger).

## Getting started

Requirements: Node.js 20+, PostgreSQL 13+.

```bash
npm install                # also runs `prisma generate`
cp .env.example .env       # set DATABASE_URL and the backend URLs
npm run db:create          # creates the database named in DATABASE_URL
npm run migrate:dev        # creates the tables
npm run start:dev          # http://localhost:3000, docs at /docs
```

Then, in a second terminal, call every endpoint and print a summary:

```bash
npm run check
```

In production the migrations are applied with `npm run migrate:deploy`.

### Scripts

| Script | Description |
| ------ | ----------- |
| `npm run start:dev` | Development with watch mode |
| `npm run db:create` | Create the database named in `DATABASE_URL` if it doesn't exist |
| `npm run check` | Call every endpoint of a running server and print a summary |
| `npm run db:studio` | Browse the tables in Prisma Studio |
| `npm run migrate:dev` | Apply migrations locally and regenerate the Prisma client |
| `npm run migrate:deploy` | Apply pending migrations (production) |
| `npm run prisma:generate` | Regenerate the Prisma client after editing the schema |
| `npm run build` / `npm start` | Production build and run |
| `npm run typecheck` | TypeScript check, including tests |
| `npm test` | Unit tests |
| `npm run test:e2e` | End-to-end tests against a real PostgreSQL (see below) |

End-to-end tests need an **empty, disposable** database:

```bash
E2E_DATABASE_URL=postgres://postgres:postgres@localhost:5432/command_centre_bff_test npm run db:create
E2E_DATABASE_URL=postgres://postgres:postgres@localhost:5432/command_centre_bff_test npm run test:e2e
```

They start the real app against fake local backends (one of them always
answers 503) and clear the `app_snapshots` table first.

## Environment variables

See `.env.example`.

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `DATABASE_URL` | — (required) | PostgreSQL connection string |
| `DATABASE_SSL` | `false` | Enable TLS for managed databases |
| `PORT` | `3000` | HTTP port |
| `FRONTEND_ORIGIN` | `http://localhost:5000` | Comma-separated origins allowed by CORS |
| `SNAPSHOT_TTL_SECONDS` | `300` | Age after which a snapshot is refreshed in the background |
| `REFRESH_LOCK_SECONDS` | `300` | After this, a stuck refresh may be restarted |
| `MANUAL_REFRESH_MIN_SECONDS` | `30` | Minimum snapshot age for `POST /snapshots/refresh` |
| `LATEST_ITEMS_LIMIT` | `5` | Latest reviews/orders kept per application |
| `HEALTH_HISTORY_RETENTION_DAYS` | `7` | How long health checks are kept |
| `UPTIME_WINDOW_HOURS` | `24` | Window for the uptime percentage on `/monitoring` |
| `<APPLICATION>_URL` | empty | Base URL of each backend; empty = not deployed |

## Project structure

```bash
prisma/
├── schema.prisma               # the two tables
└── migrations/                 # SQL applied by prisma migrate
scripts/
├── create-database.mjs         # npm run db:create
└── check-api.mjs               # npm run check
src/
├── main.ts                     # bootstrap
├── setup-app.ts                # CORS, envelope, error filter, Swagger (shared with e2e)
├── app.module.ts
│
├── config/
│   ├── applications.config.ts  # the 12 applications and their endpoints
│   ├── env.validation.ts       # fails fast on bad configuration
│   └── tokens.ts
│
├── common/
│   ├── http/                   # upstream client: 60s timeout + retry with backoff
│   ├── interceptors/           # { success: true, data }
│   └── filters/                # { success: false, statusCode, message }
│
├── prisma/
│   ├── prisma.module.ts        # Prisma client, connected on start-up
│   └── prisma.service.ts
│
├── sources/
│   ├── application-source.service.ts  # fetches one app's sections in parallel
│   └── normalizers/                   # raw responses → small uniform summaries
│
├── snapshots/
│   ├── snapshots.service.ts           # stale-while-revalidate, one refresh per app
│   ├── snapshots.repository.ts        # storage contract
│   ├── prisma-snapshots.repository.ts # PostgreSQL, atomic refresh lock
│   ├── in-memory-snapshots.repository.ts # for tests
│   └── snapshots.controller.ts        # POST /snapshots/refresh
│
├── dashboard/                  # GET /dashboard
├── monitoring/                 # GET /monitoring and /monitoring/history
└── health/                     # GET /health
test/
└── app.e2e-spec.ts
```

## Design notes

- **One refresh per application at a time.** A single SQL statement takes a
  lock row in `app_snapshots`, so concurrent requests — or several instances of
  this service — never hit the same backend at once.
- **Partial failures keep good data.** Each section is fetched independently;
  a failing one keeps its previous value and is reported in `errors`.
- **Retries only where they help.** Timeouts, 5xx and 429 are retried (2s, 4s,
  8s); 4xx errors are not.
- **No Redis yet.** PostgreSQL keeps snapshots across restarts and sleeps,
  which is what this workload needs. Redis becomes worthwhile with several
  instances, queues, or real-time updates.
- **History is pruned automatically.** Old health checks are deleted at most
  once an hour, during a refresh — no scheduler needed.

## Deploying on Render

1. Create a PostgreSQL database and a Web Service for this repository.
2. Build command `npm install && npm run build`, start command `npm start`.
3. Set `DATABASE_URL` (Internal URL), `FRONTEND_ORIGIN` (allowed CORS origins)
   and the backend URLs.
   Add `npm run migrate:deploy` to the build command so migrations are applied
   on every deploy: `npm install && npm run build && npm run migrate:deploy`.
4. Health check path: `/health`.

This service can sleep on the free tier too; it then wakes once, and still
answers from stored snapshots instead of waiting on 12 backends.
