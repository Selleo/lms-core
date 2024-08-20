import { env } from "./env.js";
import { AdminApp } from "./config/app.js";
import { DatabaseService } from "./config/database.js";

const start = async () => {
  const dbService = new DatabaseService(env.DATABASE_URL, "guidebook");
  await dbService.init();

  const app = new AdminApp(dbService);
  await app.init();
};

start();
