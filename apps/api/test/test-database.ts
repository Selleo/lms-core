import path from "path";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { GenericContainer, type StartedTestContainer } from "testcontainers";

import * as schema from "../src/storage/schema";

import type { DatabasePg } from "../src/common";

let container: StartedTestContainer;
let sql: ReturnType<typeof postgres>;
let db: DatabasePg;

export async function setupTestDatabase(): Promise<{
  db: DatabasePg;
  container: StartedTestContainer;
  connectionString: string;
}> {
  container = await new GenericContainer("postgres:16")
    .withExposedPorts(5432)
    .withEnvironment({
      POSTGRES_DB: "testdb",
      POSTGRES_USER: "testuser",
      POSTGRES_PASSWORD: "testpass",
    })
    .start();

  const connectionString = `postgresql://testuser:testpass@${container.getHost()}:${container.getMappedPort(5432)}/testdb`;

  sql = postgres(connectionString);
  db = drizzle(sql, { schema }) as DatabasePg;

  await migrate(db, {
    migrationsFolder: path.join(__dirname, "../src/storage/migrations"),
  });

  return { db, container, connectionString };
}

export async function closeTestDatabase() {
  if (sql) await sql.end();
  if (container) await container.stop();
}
