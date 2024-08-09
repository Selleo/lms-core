import { Provider } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { EmailAdapter } from "src/common/emails/adapters/email.adapter";
import { StartedTestContainer } from "testcontainers";
import { AppModule } from "../src/app.module";
import { DatabasePg } from "../src/common";
import { EmailTestingAdapter } from "./helpers/test-email.adapter";
import { setupTestDatabase } from "./test-database";

export interface TestContext {
  module: TestingModule;
  db: DatabasePg;
  container: StartedTestContainer;
  teardown: () => Promise<void>;
}

export async function createUnitTest(
  customProviders: Provider[] = [],
): Promise<TestContext> {
  const { db, container, connectionString } = await setupTestDatabase();

  process.env.DATABASE_URL = connectionString;

  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [...customProviders],
  })
    .overrideProvider(EmailAdapter)
    .useClass(EmailTestingAdapter)
    .compile();

  const teardown = async () => {
    if (container) {
      await container.stop();
    }
  };

  return {
    module,
    db,
    container,
    teardown,
  };
}
