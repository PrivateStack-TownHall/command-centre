import {
  BadRequestException,
  Controller,
  Get,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

import { MonitoringService } from "./monitoring.service";

/** A month of history is already more than any chart shows. */
const MAX_HOURS = 24 * 31;

@ApiTags("Monitoring")
@Controller("monitoring")
export class MonitoringController {
  constructor(readonly monitoring: MonitoringService) {}

  @Get()
  @ApiOperation({
    summary: "Health of every application",
    description:
      "From the same snapshots as /dashboard; `state` is online, offline, unknown or not-deployed, with uptime over the configured window.",
  })
  getMonitoring() {
    return this.monitoring.getMonitoring();
  }

  @Get("history")
  @ApiOperation({
    summary: "Stored health checks of one application",
    description: "Points for an uptime or latency chart, oldest first.",
  })
  @ApiQuery({ name: "appId", example: "kings-brew" })
  @ApiQuery({ name: "hours", required: false, example: 24 })
  getHistory(
    @Query("appId") appId?: string,
    @Query("hours", new ParseIntPipe({ optional: true })) hours = 24,
  ) {
    if (!appId) {
      throw new BadRequestException(
        `Query param "appId" is required, e.g. /monitoring/history?appId=${this.monitoring.exampleAppId()}`,
      );
    }

    if (hours < 1 || hours > MAX_HOURS) {
      throw new BadRequestException(
        `"hours" must be between 1 and ${MAX_HOURS}`,
      );
    }

    return this.monitoring.getHistory(appId, hours);
  }
}
