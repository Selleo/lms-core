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
});
