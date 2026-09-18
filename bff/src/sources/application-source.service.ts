import { Injectable } from "@nestjs/common";

import type { ResolvedApplication } from "../config/applications.config";
import {
  describeUpstreamError,
  UpstreamHttpClient,
} from "../common/http/upstream-http.client";
import type {
  AppSnapshotData,
  SectionErrors,
  SnapshotSection,
} from "../snapshots/snapshot.types";

import {
  normalizeHealth,
  normalizeMonitoring,
  normalizeStats,
  summarizeActivities,
  summarizeOrders,
  summarizeReviews,
  unreachableHealth,
} from "./normalizers";

export interface CollectResult {
  data: AppSnapshotData;
  errors: SectionErrors;
}

/** Fetches one application's sections from its backend. */
@Injectable()
export class ApplicationSourceService {
  constructor(readonly http: UpstreamHttpClient) {}

  /**
   * Sections are fetched in parallel and independently. A section that fails
   * keeps its previous value, so one broken endpoint never wipes good data.
   * Sections an app has no endpoint for stay null.
   */
  async collect(
    app: ResolvedApplication,
    previous: AppSnapshotData,
    latestLimit: number,
  ): Promise<CollectResult> {
    const data: AppSnapshotData = { ...previous };
    const errors: SectionErrors = {};

    const tasks: Array<
      [
        SnapshotSection,
        string | undefined,
        (body: unknown, latencyMs: number) => void,
      ]
    > = [
      [
        "health",
        app.healthEndpoint,
        (body, latencyMs) => (data.health = normalizeHealth(body, latencyMs)),
      ],
      [
        "stats",
        app.statsEndpoint,
        (body) => (data.stats = normalizeStats(body)),
      ],
      [
        "monitoring",
        app.monitoringEndpoint,
        (body) => (data.monitoring = normalizeMonitoring(body)),
      ],
      [
        "activities",
        app.activitiesEndpoint,
        (body) => (data.activities = summarizeActivities(body, latestLimit)),
      ],
      [
        "reviews",
        app.reviewsEndpoint,
        (body) => (data.reviews = summarizeReviews(body, latestLimit)),
      ],
      [
        "orders",
        app.ordersEndpoint,
        (body) => (data.orders = summarizeOrders(body, latestLimit)),
      ],
    ];

    await Promise.all(
      tasks.map(async ([section, endpoint, apply]) => {
        if (!endpoint) {
          data[section] = null;
          return;
        }

        try {
          const response = await this.http.get(app.baseUrl, endpoint);
          apply(response.body, response.latencyMs);
        } catch (error) {
          errors[section] = describeUpstreamError(error);

          // An unreachable backend is a fact worth showing, not stale data.
          if (section === "health") data.health = unreachableHealth();
        }
      }),
    );

    return { data, errors };
  }
}
