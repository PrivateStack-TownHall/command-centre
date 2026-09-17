import { summarizeHealth, toHealthRow } from "../health-rows";

const app = { id: "kings-brew", name: "Kings Brew", emoji: "☕" };
const ok = (status: "UP" | "DOWN", body = {}) => ({
  isPending: false,
  isError: false,
  data: { status, latencyMs: 180, body },
});

describe("toHealthRow", () => {
  it("is online with latency and uptime when the app answers UP", () => {
    expect(toHealthRow(app, ok("UP", { uptime: 3600 }))).toMatchObject({
      state: "online",
      latencyMs: 180,
      uptimeSeconds: 3600,
    });
  });

  it("is offline when the app answers DOWN or the request failed", () => {
    expect(toHealthRow(app, ok("DOWN")).state).toBe("offline");
    expect(toHealthRow(app, { isPending: false, isError: true }).state).toBe("offline");
  });

  it("is waking while the first request is still pending", () => {
    expect(toHealthRow(app, { isPending: true, isError: false }).state).toBe("waking");
  });

  it("is not deployed when there is nothing to check", () => {
    expect(toHealthRow(app, undefined).state).toBe("not-deployed");
  });
});

describe("summarizeHealth", () => {
  it("counts each state", () => {
    const rows = [
      toHealthRow(app, ok("UP")),
      toHealthRow(app, ok("UP")),
      toHealthRow(app, { isPending: true, isError: false }),
      toHealthRow(app, { isPending: false, isError: true }),
      toHealthRow(app, undefined),
    ];

    expect(summarizeHealth(rows)).toEqual({ total: 5, online: 2, waking: 1, offline: 1 });
  });
});
