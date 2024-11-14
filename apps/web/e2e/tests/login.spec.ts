import { test, expect } from "@playwright/test";

test.describe("login page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login");
  });

  test("should move to register page when sign up link is clicked", async ({ page }) => {
    await page.getByText("Sign up").click();

    await expect(page.getByRole("heading", { name: "Sign up" })).toBeVisible();
    await expect(page).toHaveURL(/register/);
  });

  test("should login as test user", async ({ page }) => {
    await page.getByLabel("email").fill("user@example.com");
    await page.getByLabel("password").fill("password");
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page).toHaveURL("/");
    await expect(page).toHaveTitle(/dashboard/i);
  });
});
