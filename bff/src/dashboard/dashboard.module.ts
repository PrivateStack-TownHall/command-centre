import { Module } from "@nestjs/common";

import { SnapshotsModule } from "../snapshots/snapshots.module";

import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
  imports: [SnapshotsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
