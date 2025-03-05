import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import cookieParser from "cookie-parser";
import { patchNestJsSwagger, applyFormats } from "nestjs-typebox";

import { AppModule } from "./app.module";
import { SentryInterceptor } from "./sentry/sentry.interceptor";
import { exportSchemaToFile } from "./utils/save-swagger-to-file";
import { setupValidation } from "./utils/setup-validation";

patchNestJsSwagger();
applyFormats();

async function bootstrap() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.useGlobalInterceptors(new SentryInterceptor());

  setupValidation();

  app.use(cookieParser());
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Guidebook API")
    .setDescription("Example usage of Swagger with Typebox")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  exportSchemaToFile(document);

  await app.listen(3000);
}
bootstrap();
