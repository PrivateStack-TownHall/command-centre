import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

import { SnapshotsRepository } from "./snapshots.repository";
import {
  emptySnapshotData,
  type AppSnapshotData,
  type HealthCheckRecord,
  type SectionErrors,
  type SnapshotRecord,
  type UptimeCount,
} from "./snapshot.types";

@Injectable()
export class PrismaSnapshotsRepository extends SnapshotsRepository {
  constructor(readonly prisma: PrismaService) {
    super();
  }

  async findAll(): Promise<SnapshotRecord[]> {
    const rows = await this.prisma.appSnapshot.findMany();

    return rows.map((row) => ({
      appId: row.appId,
      data: { ...emptySnapshotData(), ...(row.data as object) } as AppSnapshotData,
      errors: (row.errors ?? {}) as SectionErrors,
      fetchedAt: row.fetchedAt,
      refreshStartedAt: row.refreshStartedAt,
    }));
  }

  async tryAcquireRefreshLock(appId: string, lockSeconds: number): Promise<boolean> {
    // Raw SQL because it must be one statement: two callers racing here would
    // otherwise both read "no lock" and both start a refresh.
    const rows = await this.prisma.$queryRaw<Array<{ app_id: string }>>`
      INSERT INTO app_snapshots (app_id, refresh_started_at, updated_at)
      VALUES (${appId}, now(), now())
      ON CONFLICT (app_id) DO UPDATE
        SET refresh_started_at = now(), updated_at = now()
        WHERE app_snapshots.refresh_started_at IS NULL
           OR app_snapshots.refresh_started_at < now() - make_interval(secs => ${lockSeconds})
      RETURNING app_id
    `;

    return rows.length === 1;
  }

  async saveRefreshResult(
    appId: string,
    data: AppSnapshotData,
    errors: SectionErrors,
    fetchedAt: Date,
  ): Promise<void> {
    await this.prisma.appSnapshot.update({
      where: { appId },
      data: {
        data: data as unknown as Prisma.InputJsonValue,
        errors: errors as unknown as Prisma.InputJsonValue,
        fetchedAt,
        refreshStartedAt: null,
      },
    });
  }

  async releaseRefreshLock(appId: string): Promise<void> {
    await this.prisma.appSnapshot.update({
      where: { appId },
      data: { refreshStartedAt: null },
    });
  }

  async recordHealthCheck(
    appId: string,
    check: Omit<HealthCheckRecord, "checkedAt">,
  ): Promise<void> {
    await this.prisma.healthCheck.create({ data: { appId, ...check } });
  }

  async countHealthChecksSince(since: Date): Promise<Map<string, UptimeCount>> {
    const groups = await this.prisma.healthCheck.groupBy({
      by: ["appId", "status"],
      where: { checkedAt: { gte: since } },
      _count: { _all: true },
    });

    const counts = new Map<string, UptimeCount>();

    for (const group of groups) {
      const current = counts.get(group.appId) ?? { total: 0, up: 0 };
      const amount = group._count._all;

      counts.set(group.appId, {
        total: current.total + amount,
        up: current.up + (group.status === "UP" ? amount : 0),
      });
    }

    return counts;
  }

  async findHealthChecks(appId: string, since: Date): Promise<HealthCheckRecord[]> {
    const rows = await this.prisma.healthCheck.findMany({
      where: { appId, checkedAt: { gte: since } },
      orderBy: { checkedAt: "asc" },
    });

    return rows.map((row) => ({
      status: row.status === "UP" ? "UP" : "DOWN",
      reachable: row.reachable,
      latencyMs: row.latencyMs,
      checkedAt: row.checkedAt,
    }));
  }

  async deleteHealthChecksBefore(before: Date): Promise<number> {
    const { count } = await this.prisma.healthCheck.deleteMany({
      where: { checkedAt: { lt: before } },
    });

    return count;
  }

  async ping(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
