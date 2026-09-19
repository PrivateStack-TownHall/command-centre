import { Injectable } from "@nestjs/common";

import type {
  ActivityItem,
  OrderSummaryItem,
  ReviewSummaryItem,
} from "../sources/normalizers";
import { type AppSnapshotView, SnapshotsService } from "../snapshots/snapshots.service";

type WithApp<T> = T & { appId: string; appName: string; appEmoji: string };

const newestFirst = (a: { createdAt: string | null }, b: { createdAt: string | null }) =>
  (Date.parse(b.createdAt ?? "") || 0) - (Date.parse(a.createdAt ?? "") || 0);

@Injectable()
export class DashboardService {
  constructor(readonly snapshots: SnapshotsService) {}

  async getDashboard(limit = 5) {
    const applications = await this.snapshots.getSnapshots();

    return {
      generatedAt: new Date().toISOString(),
      summary: this.summarize(applications),
      latestReviews: this.mergeLatest(applications, (app) => app.reviews?.latest, limit),
      latestOrders: this.mergeLatest(applications, (app) => app.orders?.latest, limit),
      latestActivities: this.mergeLatest(
        applications,
        (app) => app.activities?.latest,
        limit,
      ),
      applications,
    };
  }

  summarize(applications: AppSnapshotView[]) {
    const deployed = applications.filter((app) => app.deployed);

    let reviewCount = 0;
    let ratingSum = 0;
    let ratedReviews = 0;
    let orderCount = 0;
    const ordersByStatus: Record<string, number> = {};

    for (const app of applications) {
      if (app.reviews) {
        reviewCount += app.reviews.total;
        if (app.reviews.averageRating !== null) {
          // Weighted by review count, so every review counts the same.
          ratingSum += app.reviews.averageRating * app.reviews.total;
          ratedReviews += app.reviews.total;
        }
      }

      if (app.orders) {
        orderCount += app.orders.total;
        for (const [status, count] of Object.entries(app.orders.byStatus)) {
          ordersByStatus[status] = (ordersByStatus[status] ?? 0) + count;
        }
      }
    }

    return {
      applications: applications.length,
      deployed: deployed.length,
      online: deployed.filter((app) => app.health?.status === "UP").length,
      offline: deployed.filter((app) => app.health?.status === "DOWN").length,
      refreshing: applications.filter((app) => app.refreshing).length,
      reviews: {
        total: reviewCount,
        averageRating: ratedReviews ? Math.round((ratingSum / ratedReviews) * 100) / 100 : null,
      },
      orders: { total: orderCount, byStatus: ordersByStatus },
    };
  }

  mergeLatest<T extends ReviewSummaryItem | OrderSummaryItem | ActivityItem>(
    applications: AppSnapshotView[],
    pick: (app: AppSnapshotView) => T[] | undefined,
    limit: number,
  ): WithApp<T>[] {
    return applications
      .flatMap((app) =>
        (pick(app) ?? []).map((item) => ({
          ...item,
          appId: app.id,
          appName: app.name,
          appEmoji: app.emoji,
        })),
      )
      .sort(newestFirst)
      .slice(0, limit);
  }
}
