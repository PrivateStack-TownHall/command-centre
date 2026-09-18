/**
 * Retry policy for the Render-hosted backends. Free instances spin down when
 * idle and take up to about a minute to wake, so the first request often
 * times out or gets a 502/503 while the service boots. Those are retried with
 * a growing delay; client errors (400/401/403/404) are not.
 */

export const MAX_RETRIES = 3;

/** Long enough for a sleeping Render instance to boot and answer. */
export const REQUEST_TIMEOUT_MS = 60_000;

interface HttpLikeError {
  code?: string;
  response?: { status?: number };
}

export function isRetryableError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const { code, response } = error as HttpLikeError;

  // No response at all: timeout, connection reset, DNS.
  if (!response) return true;

  if (code === "ECONNABORTED" || code === "ETIMEDOUT") return true;

  const status = response.status ?? 0;

  return status === 408 || status === 429 || status >= 500;
}

/** 2s, 4s, 8s … capped at 15s. `attempt` starts at 0. */
export function retryDelayMs(attempt: number): number {
  return Math.min(2000 * 2 ** attempt, 15_000);
}
