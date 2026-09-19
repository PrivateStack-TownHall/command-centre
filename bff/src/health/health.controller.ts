import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { SnapshotsRepository } from "../snapshots/snapshots.repository";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(readonly repository: SnapshotsRepository) {}

  @Get()
  @ApiOperation({ summary: "Health of the BFF itself and its database" })
  async getHealth() {
    const database = await this.repository.ping();

    return {
      status: database ? "UP" : "DOWN",
      application: "Command Centre BFF",
      database: database ? "CONNECTED" : "DISCONNECTED",
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}
