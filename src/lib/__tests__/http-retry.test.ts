import { isRetryableError, retryDelayMs, shouldRetryRequest } from "../http-retry";

const withStatus = (status: number) => ({ response: { status } });

describe("isRetryableError", () => {
  it("retries requests that never got a response (cold start, timeout)", () => {
    expect(isRetryableError({ code: "ECONNABORTED" })).toBe(true);
    expect(isRetryableError({})).toBe(true);
  });

  it("retries server errors and rate limits", () => {
    expect(isRetryableError(withStatus(502))).toBe(true);
    expect(isRetryableError(withStatus(503))).toBe(true);
    expect(isRetryableError(withStatus(429))).toBe(true);
  });

  it("does not retry client errors", () => {
    expect(isRetryableError(withStatus(400))).toBe(false);
    expect(isRetryableError(withStatus(401))).toBe(false);
    expect(isRetryableError(withStatus(404))).toBe(false);
  });

  it("ignores values that are not errors", () => {
    expect(isRetryableError(undefined)).toBe(false);
    expect(isRetryableError("boom")).toBe(false);
  });
});

describe("shouldRetryRequest", () => {
  it("stops after the maximum number of retries", () => {
    expect(shouldRetryRequest(0, withStatus(503))).toBe(true);
    expect(shouldRetryRequest(2, withStatus(503))).toBe(true);
    expect(shouldRetryRequest(3, withStatus(503))).toBe(false);
  });
});

describe("retryDelayMs", () => {
  it("doubles each attempt and caps at 15 seconds", () => {
    expect([0, 1, 2, 3, 4].map(retryDelayMs)).toEqual([2000, 4000, 8000, 15000, 15000]);
  });
});
