import { test as setup } from "@playwright/test";

import { AuthFixture } from "./fixture/auth.fixture";

setup("authenticate", async ({ page }) => {
  const authFixture = new AuthFixture(page);
  await authFixture.login("admin@example.com", "password");

  await page.context().storageState({
    path: "e2e/.auth/user.json",
  });
});
