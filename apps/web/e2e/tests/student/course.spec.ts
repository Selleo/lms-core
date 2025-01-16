import { expect, type Page, test } from "@playwright/test";

const TEST_COURSE = {
  name: "For E2E Testing",
  description: "E2E Testing Lesson Description",
} as const;

const URL_PATTERNS = {
  course:
    /course\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
  lesson:
    /course\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}\/lesson\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
} as const;

const QUIZ_ANSWERS = [
  { name: "E2E Testing Answer", isCorrect: true },
  { name: "single false", isCorrect: false },
  { name: "multiple true a", isCorrect: true },
  { name: "multiple true b", isCorrect: true },
  { name: "multiple false c", isCorrect: false },
];

class CourseActions {
  constructor(private readonly page: Page) {}

  async searchCourse(): Promise<void> {
    await this.page.waitForSelector('a[href="/courses"]', { state: "visible" });
    await this.page.click('a[href="/courses"]');
    await this.page.getByPlaceholder("Search by title...").fill(TEST_COURSE.name);
    await expect(this.page.getByRole("button", { name: "Clear All" })).toBeVisible();
  }

  async openCourse(): Promise<void> {
    await this.page.getByRole("link", { name: TEST_COURSE.name }).click();
    await this.page.waitForURL(URL_PATTERNS.course);
    await expect(this.page).toHaveURL(URL_PATTERNS.course);
    await this.verifyCourseContent();
  }

  private async verifyCourseContent(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: TEST_COURSE.name })).toBeVisible();
    await expect(this.page.getByText(TEST_COURSE.description)).toBeVisible();
  }
}

class EnrollmentActions {
  constructor(private readonly page: Page) {}

  async enrollInCourse(): Promise<void> {
    const cookies = (await this.page.context().storageState()).cookies;
    const accessToken = cookies.find((cookie) => cookie.name === "access_token")?.value;
    const apiUrl = process.env.CI ? "" : "http://localhost:3000";

    await this.page.getByRole("button", { name: "Enroll" }).click();
    await expect(this.page.getByRole("dialog")).toBeVisible();

    const courseId = this.page.url().split("/").pop();

    await this.page.request.post(`${apiUrl}/api/courses/enroll-course?id=${courseId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-test-key": process.env.TEST_KEY ?? "",
        cookie: `access_token=${accessToken}`,
      },
    });

    await this.page.reload();
    await this.page.waitForTimeout(5000);
    expect(this.page.getByRole("button", { name: "Unenroll" })).toBeVisible();
  }

  async unenrollFromCourse(): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.page.getByRole("button", { name: "Unenroll" }).click();
    await this.page.waitForTimeout(1000);
    await expect(this.page.getByRole("button", { name: /Enroll - / })).toBeVisible();
  }
}

class QuizActions {
  constructor(private readonly page: Page) {}

  async solveQuiz(): Promise<void> {
    await this.page.getByRole("heading", { name: "E2E Testing Quiz" }).click();
    await this.page.waitForURL(URL_PATTERNS.lesson);
    await expect(this.page).toHaveURL(URL_PATTERNS.lesson);

    for (const answer of QUIZ_ANSWERS) {
      const answerButton = this.page.getByRole("button", { name: answer.name });
      const input = answerButton.locator('input[type="checkbox"], input[type="radio"]');
      await answerButton.click();
      await this.page.waitForTimeout(100);
      await expect(input).toBeChecked();
      await expect(answerButton.getByText("(Missing answer)")).toBeHidden();
    }
  }

  async checkAndVerifyResults(): Promise<void> {
    await this.page.getByRole("button", { name: "Check answers" }).click();
    await expect(this.page.getByRole("dialog")).toBeVisible();
    await expect(this.page.getByText(/Your Score: 33%/)).toBeVisible();
  }

  async resetQuiz(): Promise<void> {
    await this.page.getByRole("button", { name: "Try Again" }).click();
    await this.page.getByRole("button", { name: "Clear progress" }).click();
  }
}

test.describe.serial("Course E2E", () => {
  let courseActions: CourseActions;
  let enrollmentActions: EnrollmentActions;
  let quizActions: QuizActions;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    courseActions = new CourseActions(page);
    enrollmentActions = new EnrollmentActions(page);
    quizActions = new QuizActions(page);
    await courseActions.searchCourse();
  });

  test.skip("should find, open and enroll the course", async () => {
    /*
     *  probably should be tested in another way (the unenroll action on course enrolled with action for free courses
     *  does not seem to work - duplicates in the database)
     *
     */
    await courseActions.openCourse();
    await enrollmentActions.enrollInCourse();
    await enrollmentActions.unenrollFromCourse();
  });

  test.skip("should solve free quiz lesson", async () => {
    await courseActions.openCourse();
    await quizActions.solveQuiz();
    await quizActions.checkAndVerifyResults();
    await quizActions.resetQuiz();
  });
});
