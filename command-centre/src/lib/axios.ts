import axios, { type AxiosInstance } from "axios";

import { REQUEST_TIMEOUT_MS } from "./http-retry";

const clientCache = new Map<string, AxiosInstance>();

const createApiClient = (baseURL: string): AxiosInstance => {
  const cached = clientCache.get(baseURL);

  if (cached) {
    return cached;
  }

  const client = axios.create({
    baseURL,

    headers: {
      "Content-Type": "application/json",
    },

    // A sleeping Render instance can take ~1 minute to answer.
    timeout: REQUEST_TIMEOUT_MS,
  });

  clientCache.set(baseURL, client);

  return client;
};

export default createApiClient;
