import { APPLICATION_CONFIG } from "@/features/applications/config/application.config";

export const COMMAND_CENTRE_APPLICATIONS = [
  "kings-brew",
  "castle-kitchen",
  "byte-burger",
  "trade-hub",
  "quantum-mart",
] as const;

export type CommandCentreApplicationId =
  (typeof COMMAND_CENTRE_APPLICATIONS)[number];

export const COMMAND_CENTRE_CONFIG = COMMAND_CENTRE_APPLICATIONS.map(
  (appId) => {
    const app = APPLICATION_CONFIG[appId];

    return {
      id: appId,
      name: app.app.name,
      shortName: app.app.shortName,
      description: app.app.description,
      emoji: app.emoji,
      color: app.color,
      baseUrl: app.app.url,
      endpoints: app.endpoints,
    };
  },
);
