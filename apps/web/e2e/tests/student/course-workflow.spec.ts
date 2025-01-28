import { expect, test } from "@playwright/test";

import type { Locator, Page } from "@playwright/test";

const URL_PATTERNS = {
  course:
    /course\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  lesson:
    /course\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}\/lesson\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
} as const;

const goToCoursePage = async (page: Page) => {
  await page.getByText("E2E Test: Automated Course for Full-Stack Development").click();
};

const navigateTroughTextLesson = async (page: Page, nextButton: Locator) => {
  const mainHeading = page.getByRole("heading", {
    name: "Understanding End-to-End (E2E) Testing",
  });
  await expect(mainHeading).toBeVisible();

  const introParagraph = page.locator("p", {
    hasText:
      "End-to-end (E2E) testing is a comprehensive testing method designed to verify the workflow of an application from start to finish. It ensures that all components of the system work together as expected.",
  });
  await expect(introParagraph).toBeVisible();

  const benefitsHeading = page.getByRole("heading", { name: "Benefits of E2E Testing" });
  await expect(benefitsHeading).toBeVisible();

  const benefitItems = [
    "Improved user experience by simulating real-world scenarios.",
    "Detection of integration issues between components.",
    "Verification of critical application workflows.",
  ];
  for (const item of benefitItems) {
    await expect(page.getByText(item)).toBeVisible();
  }

  const toolsHeading = page.getByRole("heading", { name: "Common Tools for E2E Testing" });
  await expect(toolsHeading).toBeVisible();

  const toolItems = [
    "Cypress: A popular tool for fast and reliable testing.",
    "Playwright: Supports cross-browser testing and advanced features.",
    "Selenium: A versatile tool for automating web browsers.",
  ];
  for (const tool of toolItems) {
    await expect(page.getByText(tool)).toBeVisible();
  }

  const whyHeading = page.getByRole("heading", { name: "Why Use E2E Testing?" });
  await expect(whyHeading).toBeVisible();

  const whyParagraph = page.getByText(
    "By using E2E testing, developers can identify issues that might not surface in unit or integration tests, providing a higher level of confidence in the application’s overall quality.",
  );

  await expect(whyParagraph).toBeVisible();

  await nextButton.click();
  await page.waitForLoadState("networkidle");
};

const navigateTroughPresentationLesson = async (page: Page, nextButton: Locator) => {
  await nextButton.click();
  await page.waitForLoadState("networkidle");
};

const navigateTroughQuiz = async (page: Page, nextButton: Locator) => {
  const briefResponseQuestion = page.getByTestId("brief-response");

  await briefResponseQuestion.click();
  await briefResponseQuestion.fill(
    "The primary purpose of E2E (End-to-End) testing is to verify the complete functionality of an application by testing user workflows and interactions across all integrated components, ensuring the system works as expected in real-world scenarios.",
  );

  const detailedResponseQuestion = page.getByTestId("detailed-response");

  await detailedResponseQuestion.click();
  await detailedResponseQuestion.fill(
    "Unit Testing: Tests individual components in isolation, ensuring their correctness. It's fast, easy to debug, and uses mocks or stubs to handle dependencies. E2E Testing: Tests the entire application workflow, ensuring integrated components work together. Simulates real user scenarios but is slower and harder to debug.",
  );

  await page.getByRole("radio", { name: "Cypress" }).check();

  await page.getByRole("checkbox", { name: "Focuses only on unit tests" }).check();
  await page.getByRole("checkbox", { name: "Validates data integrity" }).check();

  await page.getByText("True").nth(3).click();
  await page.getByText("True").nth(4).click();

  await page.locator("label").filter({ hasText: "Workflow A" }).first().click();
  await page.locator("label").filter({ hasText: "Jest" }).nth(3).click();
  await page.locator("label").filter({ hasText: "Playwright" }).first().click();

  const blank = page.getByTestId("text-blank-1");

  await blank.click();
  await blank.fill("workflow");

  const submitButton = page.getByRole("button", { name: "Submit" });

  await submitButton.click();

  await test
    .expect(briefResponseQuestion)
    .toHaveValue(
      "The primary purpose of E2E (End-to-End) testing is to verify the complete functionality of an application by testing user workflows and interactions across all integrated components, ensuring the system works as expected in real-world scenarios.",
    );
  await test
    .expect(detailedResponseQuestion)
    .toHaveValue(
      "Unit Testing: Tests individual components in isolation, ensuring their correctness. It's fast, easy to debug, and uses mocks or stubs to handle dependencies. E2E Testing: Tests the entire application workflow, ensuring integrated components work together. Simulates real user scenarios but is slower and harder to debug.",
    );

  await nextButton.click();
  await page.waitForLoadState("networkidle");
  await page.waitForURL(URL_PATTERNS.course);
};

test.describe("Course Workflow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/courses");
  });

  test("Navigate trough all the lessons", async ({ page }) => {
    await goToCoursePage(page);

    await page.waitForURL(URL_PATTERNS.course);
    await page.waitForLoadState("networkidle");

    const enrollButton = page.locator('button:has-text("Enroll to the course")');

    if ((await enrollButton.count()) > 0 && (await enrollButton.isVisible())) {
      await enrollButton.click();
    }
    await page.waitForLoadState("networkidle");

    await page.waitForTimeout(1000);

    const startLearningButton = page.locator('button:has-text("Start learning")');
    await page.waitForLoadState("networkidle");

    if ((await startLearningButton.count()) > 0 && (await startLearningButton.isVisible())) {
      await startLearningButton.click();
    } else {
      await page.getByRole("button", { name: "Continue learning" }).click();
    }

    await page.waitForURL(URL_PATTERNS.lesson);
    await page.waitForLoadState("networkidle");

    const currentLessonNumber = await page.getByTestId("current-lesson-number").textContent();
    const lessonsCount = await page.getByTestId("lessons-count").textContent();

    const navigateTroughLessons = async () => {
      for (let i = Number(currentLessonNumber) ?? 1; i <= Number(lessonsCount) ?? 0; i++) {
        const nextButtonLocator = page.locator('button:has-text("Next")');
        const completeButtonLocator = page.locator('button:has-text("Complete")');

        await page.waitForTimeout(250);

        const nextButton =
          (await nextButtonLocator.count()) > 0 ? nextButtonLocator : completeButtonLocator;

        const lessonType = await page.getByTestId("lesson-type").textContent();

        if (lessonType === "Text") {
          await navigateTroughTextLesson(page, nextButton);
        }
        if (lessonType === "Presentation") {
          await navigateTroughPresentationLesson(page, nextButton);
        }
        if (lessonType === "Quiz") {
          await navigateTroughQuiz(page, nextButton);
        }
      }
    };

    await navigateTroughLessons();
  });
});
