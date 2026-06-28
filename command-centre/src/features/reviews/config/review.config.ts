import { APPLICATION_CONFIG } from "@/features/applications/config/application.config";

export const REVIEW_APPLICATIONS = [
  "kings-brew",
  "castle-kitchen",
  "byte-burger",
  "quantum-mart",
  "trade-hub",
] as const;

export type ReviewApplicationId = (typeof REVIEW_APPLICATIONS)[number];

export const REVIEW_CONFIG = REVIEW_APPLICATIONS.map((appId) => ({
  appId,
  name: APPLICATION_CONFIG[appId].app.name,
  emoji: APPLICATION_CONFIG[appId].emoji,
  color: APPLICATION_CONFIG[appId].color,
  url: APPLICATION_CONFIG[appId].app.url,
  endpoint: APPLICATION_CONFIG[appId].endpoints.reviews,
}));
