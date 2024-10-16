import { expect, test } from "@playwright/test";

test.describe("course", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login");
  });

  test("should find, open and enroll the paid course", async ({ page }) => {
    await page.getByLabel("email").fill("user@example.com");
    await page.getByLabel("password").fill("studentpassword");
    await page.getByRole("button", { name: /login/i }).click();

    await expect(page).toHaveURL("/");
    await expect(page).toHaveTitle(/dashboard/i);

    await page
      .getByPlaceholder("Search by name or keyword...")
      .fill("For E2E Testing");
    await expect(page.getByRole("button", { name: "Clear All" })).toBeVisible();

    await page.getByRole("link", { name: "For E2E Testing" }).click();
    await expect(page).toHaveURL(
      /course\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/
    );
    await expect(page.getByText("For E2E Testing")).toBeVisible();
    await expect(
      page.getByText("E2E Testing Lesson Description")
    ).toBeVisible();
    await expect(
      page.getByText("E2E Testing Lesson 2 Description")
    ).toBeVisible();
    await expect(
      page.getByText("E2E Testing Lesson 3 Description")
    ).toBeVisible();

    await page.getByRole("button", { name: "Enroll" }).click();

    const stripeFrame = page.frameLocator(
      'iframe[title="Secure payment input frame"]'
    );
    await stripeFrame.locator("#Field-numberInput").fill("4242424242424242");
    await stripeFrame
      .locator("#Field-expiryInput")
      .fill(`10${new Date().getFullYear() + 1}`);
    await stripeFrame.locator("#Field-cvcInput").fill("123");
    await expect(page.getByText(/Buy for/)).toBeVisible();

    await page.getByRole("button", { name: /Buy for/ }).click();

    const unenrollButton = page.getByRole("button", { name: "Unenroll" });
    await unenrollButton.waitFor({ state: "visible", timeout: 10000 });
    await expect(unenrollButton).toBeVisible();
    await unenrollButton.click();
    await expect(page.getByRole("button", { name: /Enroll - / })).toBeVisible();
  });
});
