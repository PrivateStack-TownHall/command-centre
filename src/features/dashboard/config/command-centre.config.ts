import { APPLICATION_CONFIG } from "@/features/applications/config/application.config";

// Dashboard is intentionally scoped to Kings Brew only for now — it's the
// only app with /health, /stats, /monitoring, /activities implemented.
// The other commerce-core apps don't have those endpoints at all, so
// including them here would just show permanent "DOWN" cards.
export const COMMAND_CENTRE_APPLICATIONS = ["kings-brew"] as const;

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
    };
  },
);
