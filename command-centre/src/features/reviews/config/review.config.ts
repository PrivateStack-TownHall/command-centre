import { getPublicFeatureApplications } from "@/features/applications/config/public-endpoints.config";

/**
 * Applications shown on the Reviews page, derived from `publicEndpoints.reviews`
 * in application.config.ts. To add an app, set its endpoint there — nothing
 * on this page needs to change.
 */
export const REVIEW_APPLICATIONS = getPublicFeatureApplications("reviews");
