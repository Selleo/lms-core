import { env } from "./env.js";
import { AdminApp } from "./config/app.js";
import { DatabaseService } from "./config/database.js";

const getDatabaseName = (databaseUrl: string) => {
  const url = new URL(databaseUrl);
  return url.pathname.slice(1); // Removes leading '/'
};

const start = async () => {
  const databaseName = getDatabaseName(env.DATABASE_URL);
  console.log(`Connecting to database: ${databaseName}`);
  const dbService = new DatabaseService(env.DATABASE_URL, databaseName);
  await dbService.init();

  const app = new AdminApp(dbService);
  await app.init();
};

start();
