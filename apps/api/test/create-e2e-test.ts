import { Test, type TestingModule } from "@nestjs/testing";
import cookieParser from "cookie-parser";

import { AppModule } from "../src/app.module";

import { setupTestDatabase } from "./test-database";

import type { Provider } from "@nestjs/common";

export async function createE2ETest(customProviders: Provider[] = []) {
  const { db, connectionString } = await setupTestDatabase();

  process.env.DATABASE_URL = connectionString;

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [...customProviders],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix("api");
  app.use(cookieParser());

  await app.init();

  return {
    app,
    moduleFixture,
    db,
  };
}
