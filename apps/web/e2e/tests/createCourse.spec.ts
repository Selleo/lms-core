import { test, expect } from "@playwright/test";

test.describe("Add Course Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/courses");
  });
  let newCourseId;

  test("should disable the proceed button when form is incomplete", async ({ page }) => {
    await page.getByRole("button", { name: /create new/i }).click();
    await page.waitForURL("/admin/beta-courses/new");
    const proceedButton = page.getByRole("button", { name: /proceed/i });

    await expect(proceedButton).toBeDisabled();

    await page.getByLabel("Title").fill("Test Course");

    await expect(proceedButton).toBeDisabled();

    await page.getByLabel("Category").click();
    await page.locator('[data-testid="category-option-E2E Testing"]').click();

    await expect(proceedButton).toBeDisabled();

    await page.getByLabel("Description").fill("This is a test description.");

    await expect(proceedButton).not.toBeDisabled();
  });

  test("should create a new course and redirect to the course details page", async ({ page }) => {
    await page.getByRole("button", { name: /create new/i }).click();
    await page.waitForURL("/admin/beta-courses/new");
    await page.getByLabel("Title").fill("Test Course");
    await page.getByLabel("Category").click();
    await page.locator('[data-testid="category-option-E2E Testing"]').click();
    await page.getByLabel("Description").fill("This is a test description.");
    const proceedButton = page.getByRole("button", { name: /proceed/i });

    await expect(proceedButton).not.toBeDisabled();

    const responsePromise = page.waitForResponse(
      (response) => {
        return (
          response.url().includes("/api/course") && response.status() === 201
        );
      },
      { timeout: 60000 },
    );


    await proceedButton.click();

    const response = await responsePromise;

    const res = await response.json();
    newCourseId = res.data.id;

    await page.waitForURL(`admin/beta-courses/${newCourseId}`);

    const currentUrl = await page.url();
    expect(currentUrl).toMatch(`admin/beta-courses/${newCourseId}`);

    const courseTitle = await page.locator("h4").textContent();
    expect(courseTitle).toMatch("Test Course");
  });
});
