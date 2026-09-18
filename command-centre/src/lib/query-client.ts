import { QueryClient } from "@tanstack/react-query";

import { retryDelayMs, shouldRetryRequest } from "./http-retry";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Sleeping Render instances fail the first attempt(s) while booting —
      // retry those with backoff instead of showing an error straight away.
      retry: shouldRetryRequest,
      retryDelay: retryDelayMs,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});
