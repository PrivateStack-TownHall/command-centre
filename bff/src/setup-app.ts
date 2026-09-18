import type { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import type { AppEnv } from "./config/env.validation";

/** Shared by main.ts and the e2e tests, so both run the same app. */
export function setupApp(app: INestApplication) {
  const config = app.get<ConfigService<AppEnv, true>>(ConfigService);

  app.enableCors({ origin: config.get("FRONTEND_ORIGIN", { infer: true }) });
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableShutdownHooks();

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("Command Centre BFF")
      .setDescription(
        "Backend for Frontend of Command Centre — aggregates the ecosystem's APIs behind cached snapshots.",
      )
      .setVersion("0.1.0")
      .build(),
  );

  SwaggerModule.setup("docs", app, document);
}
