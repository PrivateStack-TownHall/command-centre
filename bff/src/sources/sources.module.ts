import { Module } from "@nestjs/common";

import { UpstreamHttpClient } from "../common/http/upstream-http.client";

import { ApplicationSourceService } from "./application-source.service";

@Module({
  providers: [UpstreamHttpClient, ApplicationSourceService],
  exports: [ApplicationSourceService],
})
export class SourcesModule {}
