import path from "path";
import { fileURLToPath } from "url";

import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

import type { PlaywrightTestConfig } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const baseURL = process.env.CI ? "http://localhost:5173" : "https://app.lms.localhost";

const config: PlaywrightTestConfig = {
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
    // screenshot: {
    // mode: "only-on-failure",
    // fullPage: true,
    // },
  },
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium-student",
      testDir: "./e2e/tests/student",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        storageState: "e2e/.auth/user.json",
      },
      testMatch: /.*\.(spec|test)\.ts$/,
    },
    {
      name: "chromium-admin",
      testDir: "./e2e/tests/admin",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        storageState: "e2e/.auth/admin.json",
      },
      testMatch: /.*\.(spec|test)\.ts$/,
    },
  ],
};

if (process.env.CI) {
  config.webServer = [
    {
      command: "cd ../api && pnpm run start:dev",
      url: "http://localhost:3000/api/healthcheck",
      timeout: 120 * 1000,
      reuseExistingServer: false,
      env: {
        DATABASE_URL: `postgresql://test_user:test_password@localhost:54321/test_db`,
        REDIS_HOST: "localhost",
        REDIS_PORT: "6380",
        MODE: "test",
      },
      stderr: "pipe",
      stdout: "pipe",
    },
    {
      command: "cd ../api && pnpm db:migrate && pnpm db:seed",
      env: {
        DATABASE_URL: `postgresql://test_user:test_password@localhost:54321/test_db`,
        MODE: "test",
      },
      reuseExistingServer: false,
      stderr: "pipe",
      stdout: "pipe",
    },
    {
      command: "cd ../web && pnpm run dev",
      url: "http://localhost:5173/",
      timeout: 120 * 1000,
      reuseExistingServer: false,
      env: {
        API_URL: "http://localhost:3000/api",
        MODE: "test",
      },
      stderr: "pipe",
      stdout: "pipe",
    },
  ];
}

export default defineConfig(config);
