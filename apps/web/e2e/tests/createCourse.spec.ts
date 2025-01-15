import { test, expect } from "@playwright/test";

test.describe("Add Course Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/beta-courses/new");
  });

  test("should show validation error when form is incomplete", async ({ page }) => {
    await page.getByRole("button", { name: /proceed/i }).click();

    await expect(page.getByText("Title must be at least 2 characters.")).toBeVisible();
    await expect(page.getByText("Category is required")).toBeVisible();
    await expect(page.getByText("Description must be at least 2 characters.")).toBeVisible();
  });
});
