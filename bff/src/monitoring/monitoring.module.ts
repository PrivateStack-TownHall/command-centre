import { Module } from "@nestjs/common";

import { SnapshotsModule } from "../snapshots/snapshots.module";

import { MonitoringController } from "./monitoring.controller";
import { MonitoringService } from "./monitoring.service";

@Module({
  imports: [SnapshotsModule],
  controllers: [MonitoringController],
  providers: [MonitoringService],
})
export class MonitoringModule {}
