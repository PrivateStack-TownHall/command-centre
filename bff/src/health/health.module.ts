import { Module } from "@nestjs/common";

import { SnapshotsModule } from "../snapshots/snapshots.module";

import { HealthController } from "./health.controller";

@Module({
  imports: [SnapshotsModule],
  controllers: [HealthController],
})
export class HealthModule {}
