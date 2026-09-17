import type {
  ApplicationConfig,
  PublicEndpointsConfig,
} from "../config/application.config";

export type PublicFeature = keyof PublicEndpointsConfig;

export type PublicFeatureStatus = "available" | "coming-soon";

export interface PublicFeatureApplication {
  id: string;
  name: string;
  emoji: string;
  /** Brand hex color from constants.ts, e.g. "#8B5E3C". */
  color: string;
  baseUrl: string;
  /** Path to call — only set when `status` is "available". */
  endpoint: string | null;
  status: PublicFeatureStatus;
}

/**
 * Lists the applications taking part in a cross-app page (Reviews,
 * Orders), in config order:
 *  - endpoint declared AND backend URL set → "available"
 *  - endpoint `null`, or URL not set yet    → "coming-soon"
 *  - endpoint omitted                       → not listed
 */
export function listPublicFeatureApplications(
  configs: Record<string, ApplicationConfig>,
  feature: PublicFeature,
): PublicFeatureApplication[] {
  return Object.entries(configs).flatMap(([id, config]) => {
    const endpoints = config.publicEndpoints;

    if (!endpoints || !(feature in endpoints)) return [];

    const path = endpoints[feature] ?? null;
    const baseUrl = config.app.url ?? "";
    const available = !!path && !!baseUrl;

    return [
      {
        id,
        name: config.app.name,
        emoji: config.emoji,
        color: config.app.color,
        baseUrl,
        endpoint: available ? path : null,
        status: available ? "available" : "coming-soon",
      },
    ];
  });
}
