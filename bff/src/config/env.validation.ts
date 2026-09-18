/**
 * Validates and normalises environment variables at start-up, so a missing
 * DATABASE_URL fails loudly instead of on the first request.
 */

export interface AppEnv {
  PORT: number;
  /** Connection string used by the app. On Neon this is the pooled one. */
  DATABASE_URL: string;
  /** Direct (non-pooled) connection string, used by prisma migrate. */
  DIRECT_URL: string;
  /** Comma-separated list of origins allowed by CORS. */
  FRONTEND_ORIGIN: string[];
  /** Age after which a snapshot is refreshed in the background. */
  SNAPSHOT_TTL_SECONDS: number;
  /** A refresh that started longer ago than this is considered dead. */
  REFRESH_LOCK_SECONDS: number;
  /** Minimum snapshot age before a manual refresh is accepted. */
  MANUAL_REFRESH_MIN_SECONDS: number;
  /** Max entries kept in "latest reviews/orders". */
  LATEST_ITEMS_LIMIT: number;
  /** How long health checks are kept for uptime history. */
  HEALTH_HISTORY_RETENTION_DAYS: number;
  /** Window used for the uptime percentage on /monitoring. */
  UPTIME_WINDOW_HOURS: number;
}

function toInt(value: unknown, fallback: number, name: string): number {
  if (value === undefined || value === "") return fallback;

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(
      `${name} must be a non-negative integer, got "${String(value)}"`,
    );
  }

  return parsed;
}

export function validateEnv(
  raw: Record<string, unknown>,
): AppEnv & Record<string, unknown> {
  const databaseUrl = String(raw.DATABASE_URL ?? "").trim();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required (PostgreSQL connection string)");
  }

  // Prisma reads DIRECT_URL itself for migrations; falling back to
  // DATABASE_URL keeps a plain, non-pooled setup working.
  const directUrl = String(raw.DIRECT_URL ?? "").trim() || databaseUrl;

  if (databaseUrl.includes("-pooler") && directUrl === databaseUrl) {
    console.warn(
      "DATABASE_URL points at a pooled endpoint but DIRECT_URL is not set — " +
        'prisma migrate may fail. Set DIRECT_URL to the same URL without "-pooler".',
    );
  }

  return {
    ...raw,
    PORT: toInt(raw.PORT, 3000, "PORT"),
    DATABASE_URL: databaseUrl,
    DIRECT_URL: directUrl,
    FRONTEND_ORIGIN: String(raw.FRONTEND_ORIGIN ?? "http://localhost:5000")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    SNAPSHOT_TTL_SECONDS: toInt(
      raw.SNAPSHOT_TTL_SECONDS,
      300,
      "SNAPSHOT_TTL_SECONDS",
    ),
    REFRESH_LOCK_SECONDS: toInt(
      raw.REFRESH_LOCK_SECONDS,
      300,
      "REFRESH_LOCK_SECONDS",
    ),
    MANUAL_REFRESH_MIN_SECONDS: toInt(
      raw.MANUAL_REFRESH_MIN_SECONDS,
      30,
      "MANUAL_REFRESH_MIN_SECONDS",
    ),
    LATEST_ITEMS_LIMIT: toInt(raw.LATEST_ITEMS_LIMIT, 5, "LATEST_ITEMS_LIMIT"),
    HEALTH_HISTORY_RETENTION_DAYS: toInt(
      raw.HEALTH_HISTORY_RETENTION_DAYS,
      7,
      "HEALTH_HISTORY_RETENTION_DAYS",
    ),
    UPTIME_WINDOW_HOURS: toInt(
      raw.UPTIME_WINDOW_HOURS,
      24,
      "UPTIME_WINDOW_HOURS",
    ),
  };
}
