import { test, expect } from "@playwright/test";

import { AuthFixture } from "e2e/fixture/auth.fixture";

import type { Locator, Page } from "@playwright/test";

export class CreateCourseActions {
  constructor(private readonly page: Page) {}

  async openCourse(courseId: string): Promise<void> {
    const rowSelector = `[data-course-id="${courseId}"]`;
    await this.page.locator(rowSelector).click();
    await this.page.waitForURL(`/admin/beta-courses/${courseId}`);
  }

  async verifyCoursePage(page: Page, courseId: string, expectedTitle: string): Promise<void> {
    const currentUrl = await page.url();
    expect(currentUrl).toMatch(`/admin/beta-courses/${courseId}`);

    const courseTitle = await page.locator("h4").textContent();
    expect(courseTitle).toMatch(expectedTitle);
  }

  async navigateToNewCoursePage(page: Page): Promise<void> {
    await page.getByRole("button", { name: /create new/i }).click();
    await page.waitForURL("/admin/beta-courses/new");
  }

  async fillCourseForm(page: Page, expectedTitle: string): Promise<void> {
    await page.getByLabel("Title").fill(expectedTitle);

    await page.getByLabel("Category").click();
    await page.locator('[data-testid="category-option-E2E Testing"]').click();

    await page
      .getByLabel("Description")
      .fill("This course takes you through a css course, it lets you learn the basics.");

    const fileInput = await page.locator('input[type="file"]');
    const filePath = "app/assets/thumbnail-e2e.jpg";
    await fileInput.setInputFiles(filePath);
  }

  async addChapter(page: Page, chapterTitle: string): Promise<string> {
    await page.getByRole("button", { name: /add chapter/i }).click();
    await page.getByLabel("Title").fill(chapterTitle);

    const createChapterResponsePromise = page.waitForResponse(
      (response) => {
        return (
          response.url().includes("/api/chapter/beta-create-chapter") && response.status() === 201
        );
      },
      { timeout: 60000 },
    );

    await page.getByRole("button", { name: /save/i }).click();
    const createChapterResponse = await createChapterResponsePromise;
    const createChapterResJson = await createChapterResponse.json();
    return createChapterResJson.data.id;
  }

  async addTextLesson(
    page: Page,
    chapterLocator: Locator,
    lessonTitle: string,
    lessonDescription: string,
  ): Promise<void> {
    await chapterLocator.getByRole("button", { name: /add lesson/i }).click();

    const buttonWithText = await page.locator('h3:has-text("Text")');
    const lessonButton = buttonWithText.locator("..");
    await lessonButton.click();

    await page.getByLabel("Title").fill(lessonTitle);

    const descriptionField = page.locator("#description");
    const editorInput = descriptionField.locator('div[contenteditable="true"]');
    await expect(editorInput).toBeVisible();
    await editorInput.click();
    await page.keyboard.type(lessonDescription, { delay: 100 });
    await expect(editorInput).toHaveText(lessonDescription);
    await page.getByRole("button", { name: /save/i }).click();
  }
}

test.describe.serial("Course management", () => {
  let createCourseActions: CreateCourseActions;
  let newCourseId: string;
  let newChapterId: string;
  const expectedTitle = "CSS Fundamentals";
  // Page have to be defined here to use it inside beforeAll, we need it to login as a Admin.
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const authFixture = new AuthFixture(page);
    await page.goto("/");
    await authFixture.logout();
    await page.waitForURL("/auth/login");
    await authFixture.login("admin@example.com", "password");
  });

  test.beforeEach(async () => {
    await page.goto("/admin/courses");
    createCourseActions = new CreateCourseActions(page);
  });

  test("should click cancel button and back to the course list", async () => {
    await createCourseActions.navigateToNewCoursePage(page);

    await page.getByRole("button", { name: /cancel/i }).click();
    await page.waitForURL("/admin/courses");

    const currentUrl = await page.url();
    expect(currentUrl).toMatch("/admin/courses");
  });

  test("should disable the proceed button when form is incomplete", async () => {
    await createCourseActions.navigateToNewCoursePage(page);

    const proceedButton = page.getByRole("button", { name: /proceed/i });

    await expect(proceedButton).toBeDisabled();

    await createCourseActions.fillCourseForm(page, expectedTitle);
    await expect(proceedButton).not.toBeDisabled();
  });

  test("should create a new course with chapter and lesson", async () => {
    await createCourseActions.navigateToNewCoursePage(page);

    await createCourseActions.fillCourseForm(page, expectedTitle);

    const proceedButton = page.getByRole("button", { name: /proceed/i });

    await expect(proceedButton).not.toBeDisabled();

    const courseResponsePromise = page.waitForResponse(
      (response) => {
        return response.url().includes("/api/course") && response.status() === 201;
      },
      { timeout: 60000 },
    );

    await proceedButton.click();

    const courseResponse = await courseResponsePromise;

    const courseResJson = await courseResponse.json();
    newCourseId = courseResJson.data.id;

    await page.waitForURL(`admin/beta-courses/${newCourseId}`);
    await createCourseActions.verifyCoursePage(page, newCourseId, expectedTitle);

    newChapterId = await createCourseActions.addChapter(page, "CSS Introduction");

    const chapterLocator = page.locator(`[data-chapter-id="${newChapterId}"]`);
    await expect(chapterLocator).toBeVisible();

    await createCourseActions.addTextLesson(
      page,
      chapterLocator,
      "Introduction to CSS",
      "CSS is a style sheet language used for describing the presentation of a document written in HTML.",
    );

    const lessonLocator = chapterLocator.locator('div[aria-label="Lesson: Introduction to CSS"]');
    await expect(lessonLocator).toBeVisible();
  });

  test("should check if course occurs on course list", async () => {
    await createCourseActions.openCourse(newCourseId);

    await createCourseActions.verifyCoursePage(page, newCourseId, expectedTitle);
  });
});
