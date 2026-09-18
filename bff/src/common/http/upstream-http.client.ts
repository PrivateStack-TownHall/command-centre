import { Injectable } from "@nestjs/common";
import axios, { type AxiosInstance } from "axios";

import {
  isRetryableError,
  MAX_RETRIES,
  REQUEST_TIMEOUT_MS,
  retryDelayMs,
} from "./retry";

export interface UpstreamResponse {
  body: unknown;
  /** Duration of the attempt that succeeded, in milliseconds. */
  latencyMs: number;
  /** Retries needed before it succeeded (0 = first try). */
  retries: number;
}

export type Sleep = (ms: number) => Promise<void>;

const defaultSleep: Sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** HTTP client for the ecosystem's backends: long timeout plus retry with
 *  backoff for the failures a cold start produces. */
@Injectable()
export class UpstreamHttpClient {
  readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      timeout: REQUEST_TIMEOUT_MS,
      headers: { Accept: "application/json" },
    });
  }

  /** Overridable in tests to avoid real waiting. */
  sleep: Sleep = defaultSleep;

  async get(baseUrl: string, path: string): Promise<UpstreamResponse> {
    let attempt = 0;

    for (;;) {
      const startedAt = Date.now();

      try {
        const response = await this.http.get(`${baseUrl}${path}`);

        return {
          body: response.data,
          latencyMs: Date.now() - startedAt,
          retries: attempt,
        };
      } catch (error) {
        if (attempt >= MAX_RETRIES || !isRetryableError(error)) {
          throw error;
        }

        await this.sleep(retryDelayMs(attempt));
        attempt += 1;
      }
    }
  }
}

/** Short, log-friendly description of an upstream failure. */
export function describeUpstreamError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) return `HTTP ${error.response.status}`;
    if (error.code) return error.code;
  }

  return error instanceof Error ? error.message : "Unknown error";
}
