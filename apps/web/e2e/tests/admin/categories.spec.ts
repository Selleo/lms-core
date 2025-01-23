import { test, expect } from "@playwright/test";

const NEW_CATEGORY = {
  title: "Software development E2E",
  button: {
    createNew: "create new",
    createCategory: "create category",
    save: "save",
  },
  label: {
    title: "Title",
  },
} as const;

test.describe("Admin categories", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  test("should create category and change it to archive", async ({ page }) => {
    await page.goto("/admin/categories");
    await page
      .getByRole("button", { name: new RegExp(NEW_CATEGORY.button.createNew, "i") })
      .click();
    await page.waitForURL("/admin/categories/new");
    await page.getByLabel(NEW_CATEGORY.label.title).fill(NEW_CATEGORY.title);
    await page
      .getByRole("button", { name: new RegExp(NEW_CATEGORY.button.createCategory, "i") })
      .click();
    await page.goto("/admin/categories");
    const createdCategoryRow = page.locator(`td div.max-w-md:has-text("${NEW_CATEGORY.title}")`);
    await expect(createdCategoryRow).toBeVisible();
    await createdCategoryRow.click();
    await page.locator("#archived").click();
    await page.getByRole("button", { name: new RegExp(NEW_CATEGORY.button.save, "i") }).click();
    await page.goto("/admin/categories");
    await expect(createdCategoryRow).not.toBeVisible();
  });
});
