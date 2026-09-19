import "reflect-metadata";

import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import type { AppEnv } from "./config/env.validation";
import { setupApp } from "./setup-app";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupApp(app);

  const port = app.get<ConfigService<AppEnv, true>>(ConfigService).get("PORT", { infer: true });

  await app.listen(port);

  Logger.log(`Command Centre BFF on http://localhost:${port} (docs at /docs)`, "Bootstrap");
}

void bootstrap();
