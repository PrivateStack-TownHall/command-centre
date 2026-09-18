import { averageLatency, uptimePercent } from "./uptime";

describe("uptimePercent", () => {
  it("rounds to one decimal", () => {
    expect(uptimePercent({ total: 3, up: 2 })).toBe(66.7);
    expect(uptimePercent({ total: 4, up: 4 })).toBe(100);
  });

  it("is null when nothing was checked yet", () => {
    expect(uptimePercent({ total: 0, up: 0 })).toBeNull();
    expect(uptimePercent(undefined)).toBeNull();
  });
});

describe("averageLatency", () => {
  it("ignores checks without a latency", () => {
    expect(averageLatency([100, null, 200])).toBe(150);
    expect(averageLatency([null, null])).toBeNull();
  });
});
