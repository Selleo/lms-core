import path from "path";
import { fileURLToPath } from "url";

import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const baseURL = process.env.VITE_APP_URL || "https://app.lms.localhost";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL,
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: [
        "--ignore-certificate-errors",
        "--ignore-certificate-errors-spki-list",
        "--ignore-ssl-errors",
        "--disable-web-security",
        "--allow-insecure-localhost",
        "--disable-features=IsolateOrigins,site-per-process",
      ],
    },
  },
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        storageState: "e2e/.auth/user.json",
      },
      testMatch: /.*\.(spec|test)\.ts$/,
    },
  ],
  webServer: [
    {
      command: "cd ../api && pnpm run start:dev",
      url: "http://localhost:3000/api/healthcheck",
      timeout: 120 * 1000,
      reuseExistingServer: false,
      env: {
        DATABASE_URL: `postgresql://test_user:test_password@localhost:54321/test_db`,
        REDIS_HOST: "localhost",
        REDIS_PORT: "6380",
        NODE_ENV: "test",
      },
    },
    {
      command: "cd ../api && pnpm db:migrate && pnpm db:seed",
      env: {
        DATABASE_URL: `postgresql://test_user:test_password@localhost:54321/test_db`,
        NODE_ENV: "test",
      },
      reuseExistingServer: false,
    },
    {
      command: "cd ../web && pnpm run dev",
      url: "http://localhost:5173/",
      timeout: 120 * 1000,
      reuseExistingServer: false,
      env: {
        API_URL: "https://app.lms.localhost/api",
      },
    },
    {
      command: "cd ../reverse-proxy && pnpm run dev",
      url: "http://localhost:2019/config/",
      timeout: 120 * 1000,
      reuseExistingServer: false,
    },
  ],
});
