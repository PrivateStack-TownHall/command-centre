import { APPLICATIONS } from "@/lib/constants";

/**
 * Thin hook so the page doesn't reach into `lib/constants` directly.
 * Placeholder for now — a natural place to merge in live per-app status
 * later (e.g. reusing Kings Brew's /health data once more apps expose
 * it), without changing CityMap or EcosystemMapPage.
 */
export function useEcosystemMap() {
  return {
    applications: APPLICATIONS,
  };
}
