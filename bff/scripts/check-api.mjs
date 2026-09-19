/**
 * Calls every endpoint and prints a readable summary — a replacement for
 * curl while developing.
 *
 *   npm run check                     (http://localhost:3000)
 *   BFF_URL=https://... npm run check
 */
const baseUrl = (process.env.BFF_URL ?? "http://localhost:3000").replace(/\/+$/, "");

async function call(method, path) {
  const response = await fetch(`${baseUrl}${path}`, { method });
  const body = await response.json();

  if (!response.ok) {
    throw new Error(`${method} ${path} → ${response.status} ${body.message ?? ""}`);
  }

  return body.data;
}

const line = (label, value) => console.log(`  ${label.padEnd(22)} ${value}`);

try {
  console.log(`\nChecking ${baseUrl}\n`);

  const health = await call("GET", "/health");
  console.log("GET /health");
  line("status", health.status);
  line("database", health.database);

  const dashboard = await call("GET", "/dashboard");
  const { summary } = dashboard;
  console.log("\nGET /dashboard");
  line("applications", `${summary.applications} (${summary.deployed} deployed)`);
  line("online / offline", `${summary.online} / ${summary.offline}`);
  line("refreshing", summary.refreshing);
  line("reviews", `${summary.reviews.total} (avg ${summary.reviews.averageRating ?? "-"})`);
  line("orders", summary.orders.total);
  line("latest reviews", dashboard.latestReviews.length);
  line("latest orders", dashboard.latestOrders.length);

  console.log("\n  per application:");
  for (const app of dashboard.applications) {
    const errors = Object.keys(app.errors);
    const age = app.ageSeconds === null ? "never" : `${app.ageSeconds}s ago`;

    console.log(
      `    ${app.emoji} ${app.name.padEnd(17)} ${app.freshness.padEnd(13)} ${age.padEnd(12)}` +
        `${app.refreshing ? "refreshing " : ""}${errors.length ? `errors: ${errors.join(", ")}` : ""}`,
    );
  }

  const monitoring = await call("GET", "/monitoring");
  console.log(`\nGET /monitoring (uptime over ${monitoring.uptimeWindowHours}h)`);
  for (const app of monitoring.applications) {
    const uptime = app.uptimePercent === null ? "-" : `${app.uptimePercent}%`;
    const latency = app.health?.latencyMs == null ? "-" : `${app.health.latencyMs}ms`;

    console.log(`    ${app.emoji} ${app.name.padEnd(17)} ${app.state.padEnd(13)} ${uptime.padEnd(8)} ${latency}`);
  }

  const first = monitoring.applications.find((app) => app.state !== "not-deployed");

  if (first) {
    const history = await call("GET", `/monitoring/history?appId=${first.id}&hours=24`);
    console.log(`\nGET /monitoring/history (${history.name})`);
    line("checks stored", history.checks.length);
    line("uptime", history.uptimePercent === null ? "-" : `${history.uptimePercent}%`);
    line("average latency", history.averageLatencyMs === null ? "-" : `${history.averageLatencyMs}ms`);
  }

  const refresh = await call("POST", "/snapshots/refresh");
  const accepted = refresh.filter((item) => item.accepted).length;
  console.log("\nPOST /snapshots/refresh");
  line("refreshes started", `${accepted} of ${refresh.length}`);

  console.log("\nAll endpoints answered.\n");
} catch (error) {
  console.error(`\n${error.message}`);
  console.error("Is the server running? Start it with: npm run start:dev\n");
  process.exit(1);
}
