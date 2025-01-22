import { expect, test, type Page } from "@playwright/test";

const TEST_COURSE = {
  name: "For E2E Testing",
  course_description: "DO NOT DELETE THIS COURSE.",
} as const;

const URL_PATTERNS = {
  course:
    /admin\/beta-courses\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
} as const;

class CourseActions {
  constructor(private readonly page: Page) {}

  async searchCourse(): Promise<void> {
    await this.page.waitForSelector('a[href="/admin/courses"]', { state: "visible" });
    await this.page.getByText("My Courses").click();
    await this.page.getByPlaceholder(/Search by title/).fill(TEST_COURSE.name);
    await expect(this.page.getByRole("button", { name: "Clear All" })).toBeVisible();
  }

  async openCourse(): Promise<void> {
    await this.page.getByRole("row", { name: TEST_COURSE.name }).click();
    await this.page.waitForURL(URL_PATTERNS.course);
    await expect(this.page).toHaveURL(URL_PATTERNS.course);
    await this.verifyCourseContent();
  }

  private async verifyCourseContent(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: TEST_COURSE.name })).toBeVisible();
  }
}

test.describe.serial("Course E2E", () => {
  let courseActions: CourseActions;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    courseActions = new CourseActions(page);
    await courseActions.searchCourse();
    await courseActions.openCourse();
  });

  test("should change course price to free", async ({ page }) => {
    await page.getByRole("tab", { name: "Pricing" }).click();
    await page.getByText("Free").click();
    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();

    await expect(page.locator("#isFree")).toBeChecked();
  });

  test("should change course price to paid", async ({ page }) => {
    await page.getByRole("tab", { name: "Pricing" }).click();
    await page.getByText("Paid course").click();
    await page.getByPlaceholder("Amount").fill("42069");
    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();

    await expect(page.locator("#isPaid")).toBeChecked();
    await expect(page.getByPlaceholder("Amount")).toHaveValue("42,069.00");
  });

  test("should change course status to draft", async ({ page }) => {
    await page.getByRole("tab", { name: "Status" }).click();
    await page.getByText("Draft").click();
    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();

    await expect(page.locator("#draft")).toBeChecked();
  });

  test("should change course status to published", async ({ page }) => {
    await page.getByRole("tab", { name: "Status" }).click();
    await page.getByLabel("Published").click();
    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();

    await expect(page.locator("#published")).toBeChecked();
  });

  test("should change course title", async ({ page }) => {
    await page.getByRole("tab", { name: "Settings" }).click();
    await page.getByLabel("Course title").fill(`${TEST_COURSE.name} test`);

    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();

    await expect(
      page.getByRole("heading", { name: `${TEST_COURSE.name} test`, level: 4 }),
    ).toBeVisible();
  });

  test("should change course description", async ({ page }) => {
    await page.getByRole("tab", { name: "Settings" }).click();
    await page.getByLabel("Description").fill(`${TEST_COURSE.course_description} test`);

    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();

    await expect(page.getByLabel("Description")).toHaveValue(
      `${TEST_COURSE.course_description} test`,
    );
  });

  test("should change course values to defults all at once", async ({ page }) => {
    await page.getByRole("tab", { name: "Settings" }).click();
    await page.getByLabel("Course title").fill(TEST_COURSE.name);
    await page.getByLabel("Description").fill(TEST_COURSE.course_description);
    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();
    await expect(page.getByRole("heading", { name: TEST_COURSE.name, level: 4 })).toBeVisible();
    await expect(page.getByLabel("Description")).toHaveValue(TEST_COURSE.course_description);

    await page.getByRole("tab", { name: "Pricing" }).click();
    await page.getByText("Free").click();
    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();
    await expect(page.locator("#isFree")).toBeChecked();

    await page.getByRole("tab", { name: "Status" }).click();
    await page.getByLabel("Published").click();
    await page.getByRole("button", { name: "Save" }).click();
    await page.reload();
    await expect(page.locator("#published")).toBeChecked();
  });
});
