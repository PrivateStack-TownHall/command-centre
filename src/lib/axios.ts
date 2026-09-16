import axios, { type AxiosInstance } from "axios";

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

    timeout: 10000,
  });

  clientCache.set(baseURL, client);

  return client;
};

export default createApiClient;
