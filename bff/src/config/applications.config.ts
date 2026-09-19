/**
 * The ecosystem's applications, as seen from the BFF. Mirrors
 * `application.config.ts` in the front-end, limited to what the BFF needs:
 * where each backend lives and which public endpoints it exposes
 * (confirmed against each backend's Swagger).
 */

export type ApplicationGroup = "commerce-core" | "operations-core" | "template";

export interface ApplicationDefinition {
  id: string;
  name: string;
  emoji: string;
  group: ApplicationGroup;
  /** Environment variable holding the backend's base URL. Empty = not deployed. */
  urlEnv: string;
  /** "/health" where it exists; commerce apps without it answer GET "/" with
   *  `{ success: true }`, which is enough for UP/DOWN. */
  healthEndpoint?: string;
  statsEndpoint?: string;
  /** Process, memory and database information (Kings Brew only so far). */
  monitoringEndpoint?: string;
  /** Public feed of recent events (Kings Brew only so far). */
  activitiesEndpoint?: string;
  /** Flat, unauthenticated lists used for the "latest" sections. */
  reviewsEndpoint?: string;
  ordersEndpoint?: string;
}

export const APPLICATIONS: readonly ApplicationDefinition[] = [
  {
    id: "kings-brew",
    name: "Kings Brew",
    emoji: "☕",
    group: "commerce-core",
    urlEnv: "KINGS_BREW_URL",
    healthEndpoint: "/health",
    statsEndpoint: "/stats",
    monitoringEndpoint: "/monitoring",
    activitiesEndpoint: "/activities",
    reviewsEndpoint: "/reviews",
    ordersEndpoint: "/public/orders",
  },
  {
    id: "castle-kitchen",
    name: "Castle Kitchen",
    emoji: "🥩",
    group: "commerce-core",
    urlEnv: "CASTLE_KITCHEN_URL",
    healthEndpoint: "/health",
    statsEndpoint: "/stats",
    monitoringEndpoint: "/monitoring",
    activitiesEndpoint: "/activities",
    reviewsEndpoint: "/reviews",
    ordersEndpoint: "/public/orders",
  },
  {
    id: "byte-burger",
    name: "Byte Burger",
    emoji: "🍔",
    group: "commerce-core",
    urlEnv: "BYTE_BURGER_URL",
    healthEndpoint: "/health",
    statsEndpoint: "/stats",
    monitoringEndpoint: "/monitoring",
    activitiesEndpoint: "/activities",
    reviewsEndpoint: "/reviews",
    ordersEndpoint: "/public/orders",
  },
  {
    id: "quantum-mart",
    name: "Quantum Mart",
    emoji: "🛒",
    group: "commerce-core",
    urlEnv: "QUANTUM_MART_URL",
    healthEndpoint: "/health",
    statsEndpoint: "/stats",
    monitoringEndpoint: "/monitoring",
    activitiesEndpoint: "/activities",
    reviewsEndpoint: "/reviews",
    ordersEndpoint: "/public/orders",
  },
  {
    id: "trade-hub",
    name: "Trade Hub",
    emoji: "🏪",
    group: "commerce-core",
    urlEnv: "TRADE_HUB_URL",
    healthEndpoint: "/health",
    statsEndpoint: "/stats",
    monitoringEndpoint: "/monitoring",
    activitiesEndpoint: "/activities",
    reviewsEndpoint: "/reviews",
    ordersEndpoint: "/public/orders",
  },
  {
    id: "pineapple-stack",
    name: "Pineapple Stack",
    emoji: "🍍",
    group: "operations-core",
    urlEnv: "PINEAPPLE_STACK_URL",
    healthEndpoint: "/health",
    statsEndpoint: "/stats",
    monitoringEndpoint: "/monitoring",
    activitiesEndpoint: "/activities",
  },
  {
    id: "m-ployee",
    name: "M-ployee",
    emoji: "👨‍💼",
    group: "operations-core",
    urlEnv: "M_PLOYEE_URL",
    healthEndpoint: "/health",
    statsEndpoint: "/stats",
    monitoringEndpoint: "/monitoring",
    activitiesEndpoint: "/activities",
  },
  {
    id: "codigram",
    name: "Codigram",
    emoji: "📸",
    group: "operations-core",
    urlEnv: "CODIGRAM_URL",
    healthEndpoint: "/health",
    statsEndpoint: "/stats",
    monitoringEndpoint: "/monitoring",
    activitiesEndpoint: "/activities",
  },
  {
    id: "leather-shelf",
    name: "Leather Shelf",
    emoji: "📚",
    group: "operations-core",
    urlEnv: "LEATHER_SHELF_URL",
    healthEndpoint: "/health",
    statsEndpoint: "/stats",
    monitoringEndpoint: "/monitoring",
    activitiesEndpoint: "/activities",
  },
  {
    id: "waretrack",
    name: "WareTrack",
    emoji: "📦",
    group: "operations-core",
    urlEnv: "WARETRACK_URL",
    healthEndpoint: "/health",
    statsEndpoint: "/stats",
    monitoringEndpoint: "/monitoring",
    activitiesEndpoint: "/activities",
  },
  {
    id: "medieval-airbnb",
    name: "Medieval Airbnb",
    emoji: "🏡",
    group: "template",
    urlEnv: "MEDIEVAL_AIRBNB_URL",
  },
  {
    id: "nomad",
    name: "Nomad",
    emoji: "🧭",
    group: "template",
    urlEnv: "NOMAD_URL",
  },
];

/** An application with its base URL resolved from the environment. */
export interface ResolvedApplication extends ApplicationDefinition {
  baseUrl: string;
  deployed: boolean;
}

export function resolveApplications(
  env: Record<string, string | undefined>,
): ResolvedApplication[] {
  return APPLICATIONS.map((app) => {
    const baseUrl = (env[app.urlEnv] ?? "").trim().replace(/\/+$/, "");

    return { ...app, baseUrl, deployed: baseUrl.length > 0 };
  });
}
