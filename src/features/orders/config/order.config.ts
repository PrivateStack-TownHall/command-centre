import { getPublicFeatureApplications } from "@/features/applications/config/public-endpoints.config";

/**
 * Applications shown on the Orders page, derived from `publicEndpoints.orders`
 * in application.config.ts. To add an app, set its endpoint there — nothing
 * on this page needs to change.
 */
export const ORDER_APPLICATIONS = getPublicFeatureApplications("orders");
