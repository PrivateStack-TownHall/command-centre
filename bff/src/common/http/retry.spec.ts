import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

import { isRetryableError, retryDelayMs } from "./retry";
import { UpstreamHttpClient } from "./upstream-http.client";

describe("isRetryableError", () => {
  it("retries missing responses, timeouts, 5xx and 429", () => {
    expect(isRetryableError({})).toBe(true);
    expect(isRetryableError({ code: "ECONNABORTED" })).toBe(true);
    expect(isRetryableError({ response: { status: 503 } })).toBe(true);
    expect(isRetryableError({ response: { status: 429 } })).toBe(true);
  });

  it("does not retry client errors or non-errors", () => {
    expect(isRetryableError({ response: { status: 401 } })).toBe(false);
    expect(isRetryableError({ response: { status: 404 } })).toBe(false);
    expect(isRetryableError(undefined)).toBe(false);
  });
});

describe("retryDelayMs", () => {
  it("doubles and caps at 15 seconds", () => {
    expect([0, 1, 2, 3].map(retryDelayMs)).toEqual([2000, 4000, 8000, 15000]);
  });
});

describe("UpstreamHttpClient", () => {
  let server: Server;
  let baseUrl: string;
  let hits = 0;

  beforeAll(async () => {
    server = createServer((req, res) => {
      hits += 1;
      if (req.url === "/wakes-up" && hits < 3) {
        res.writeHead(503).end();
        return;
      }
      if (req.url === "/missing") {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { "content-type": "application/json" }).end('{"status":"UP"}');
    });
    await new Promise<void>((resolve) => server.listen(0, resolve));
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  });

  afterAll(() => new Promise((resolve) => server.close(resolve)));

  const client = () => {
    const instance = new UpstreamHttpClient();
    instance.sleep = async () => undefined;
    return instance;
  };

  it("retries a backend that is still booting until it answers", async () => {
    hits = 0;
    const response = await client().get(baseUrl, "/wakes-up");

    expect(response.body).toEqual({ status: "UP" });
    expect(response.retries).toBe(2);
  });

  it("gives up immediately on a client error", async () => {
    hits = 0;
    await expect(client().get(baseUrl, "/missing")).rejects.toThrow();
    expect(hits).toBe(1);
  });
});
