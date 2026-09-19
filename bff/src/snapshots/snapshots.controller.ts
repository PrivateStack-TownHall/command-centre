import { Controller, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

import { SnapshotsService } from "./snapshots.service";

@ApiTags("Snapshots")
@Controller("snapshots")
export class SnapshotsController {
  constructor(readonly snapshots: SnapshotsService) {}

  @Post("refresh")
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: "Refresh snapshots now",
    description:
      "Starts a background refresh. Rate-limited per application by MANUAL_REFRESH_MIN_SECONDS; results arrive on the next GET /dashboard or /monitoring.",
  })
  @ApiQuery({ name: "appId", required: false, example: "kings-brew" })
  requestRefresh(@Query("appId") appId?: string) {
    return this.snapshots.requestRefresh(appId);
  }
}
