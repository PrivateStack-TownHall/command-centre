import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { validateEnv } from "./config/env.validation";
import { DashboardModule } from "./dashboard/dashboard.module";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthModule } from "./health/health.module";
import { MonitoringModule } from "./monitoring/monitoring.module";
import { SnapshotsModule } from "./snapshots/snapshots.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    PrismaModule,
    SnapshotsModule,
    DashboardModule,
    MonitoringModule,
    HealthModule,
  ],
})
export class AppModule {}
