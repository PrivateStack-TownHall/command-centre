import axios from "axios";

import { unwrapItem } from "@/lib/api-response";

import type { BffDashboard, BffMonitoring } from "../types/bff.type";

/** Base URL of the Command Centre BFF, e.g. http://localhost:3000 */
export const BFF_URL = (import.meta.env.VITE_BFF_URL ?? "").replace(/\/+$/, "");

/*
 * The BFF answers from its database, so it is fast or not there at all —
 * unlike the Render backends it talks to, it never needs a cold-start
 * timeout. A short one turns "BFF not running" into an error straight away.
 */
const http = axios.create({
  baseURL: BFF_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

export const bffQueryKeys = {
  dashboard: ["bff", "dashboard"] as const,
  monitoring: ["bff", "monitoring"] as const,
};

async function get<T>(path: string): Promise<T> {
  if (!BFF_URL) {
    throw new Error("VITE_BFF_URL is not set");
  }

  const response = await http.get(path);

  const data = unwrapItem<T>(response.data);

  if (!data) {
    throw new Error(`The BFF returned no data for ${path}`);
  }

  return data;
}

export const bffApi = {
  getDashboard: () => get<BffDashboard>("/dashboard"),
  getMonitoring: () => get<BffMonitoring>("/monitoring"),
};
