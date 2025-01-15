import path from 'path';

import { test, expect } from "@playwright/test";



test.describe("Add Course Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/courses");
    
    await page.getByRole("button", { name: /create new/i }).click();    
    await page.waitForURL("/admin/beta-courses/new");
  });

  test("should disable the proceed button when form is incomplete", async ({ page }) => {
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

    await page.getByLabel("Title").fill("Test Course");
    await page.getByLabel("Category").click(); 
    await page.locator('[data-testid="category-option-E2E Testing"]').click();
    await page.getByLabel("Description").fill("This is a test description.");
    const proceedButton = page.getByRole("button", { name: /proceed/i });

    await expect(proceedButton).not.toBeDisabled();
    await proceedButton.click();

  //   const responsePromise = page.waitForResponse(
  //     (response) => {
  //         return response.url().includes('/api/course/beta-course-by-id') && response.status() === 200;
  //     },
  //     { timeout: 60000 }
  // );


  // const response = await responsePromise;

  // const responseData = await response.json();
  // const courseId = responseData.id; 

    await page.waitForURL(url => url.href.includes('/admin/beta-courses/'));

    const currentUrl = await page.url();
    expect(currentUrl).toMatch(/\/admin\/beta-courses\/\d+/);

    const courseTitle = await page.locator('h1').textContent();
    expect(courseTitle).toBe("Test Course");

});
})

