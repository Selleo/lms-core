import { test, expect } from "@playwright/test";

import { AuthFixture } from "e2e/fixture/auth.fixture";

test.describe("register page", () => {
  test.beforeEach(async ({ page }) => {
    const authFixture = new AuthFixture(page);
    await page.goto("/");
    await authFixture.logout();
    await page.goto("/auth/register");
  });

  test("register user", async ({ page }) => {
    await page.getByLabel("first name").fill("testname");
    await page.getByLabel("last name").fill("testlastname");
    await page.getByLabel("email").fill("test@useraaaa.com");
    await page.getByLabel("password").fill("password");

    await page.route("**/auth/register", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        json: { data: { email: "", id: "", createdAt: "", updatedAt: "" } },
      });
    });

    await page.getByRole("button", { name: /create/i }).click();

    await expect(page).toHaveURL(/login/);
  });

  test("fail on invalid credentials", async ({ page }) => {
    await page.getByLabel("email").fill("user@example");
    await page.getByLabel("password").fill("pass");

    await page.getByRole("button", { name: /create/i }).click();

    await expect(page.getByText("Invalid email")).toBeVisible();
    await expect(page.getByText("Password must be at least 8 characters")).toBeVisible();
  });
});
