import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { DashboardService } from "./dashboard.service";

@ApiTags("Dashboard")
@Controller("dashboard")
export class DashboardController {
  constructor(readonly dashboard: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: "Dashboard data for every application",
    description:
      "Answers immediately from stored snapshots. Each application carries `freshness`, `fetchedAt` and `refreshing`; stale or missing snapshots are refreshed in the background.",
  })
  getDashboard() {
    return this.dashboard.getDashboard();
  }
}
