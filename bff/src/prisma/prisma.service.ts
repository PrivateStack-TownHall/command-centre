import { Injectable, Logger, type OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

/** The Prisma client, connected when the app starts. */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();

    this.logger.log("Connected to the database");
  }
}
