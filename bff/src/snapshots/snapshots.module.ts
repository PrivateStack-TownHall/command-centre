import { Module } from "@nestjs/common";

import { resolveApplications } from "../config/applications.config";
import { APPLICATIONS_TOKEN, CLOCK_TOKEN } from "../config/tokens";
import { SourcesModule } from "../sources/sources.module";

import { PrismaSnapshotsRepository } from "./prisma-snapshots.repository";
import { SnapshotsController } from "./snapshots.controller";
import { SnapshotsRepository } from "./snapshots.repository";
import { SnapshotsService } from "./snapshots.service";

@Module({
  imports: [SourcesModule],
  controllers: [SnapshotsController],
  providers: [
    SnapshotsService,
    { provide: SnapshotsRepository, useClass: PrismaSnapshotsRepository },
    {
      // ConfigModule has already loaded .env into process.env by now.
      provide: APPLICATIONS_TOKEN,
      useFactory: () => resolveApplications(process.env),
    },
    { provide: CLOCK_TOKEN, useValue: () => new Date() },
  ],
  exports: [SnapshotsService, SnapshotsRepository],
})
export class SnapshotsModule {}
