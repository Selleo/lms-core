import { expect, test, type Page } from "@playwright/test";

const TEST_COURSE = {
  name: "For E2E Testing",
  description: "E2E Testing Lesson Description",
} as const;

const PAYMENT_DATA = {
  cardNumber: "4242424242424242",
  cvc: "123",
  expiryMonth: "10",
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
    await this.page.getByPlaceholder("Search by title...").fill(TEST_COURSE.name);
    await expect(this.page.getByRole("button", { name: "Clear All" })).toBeVisible();
  }

  async openCourse(): Promise<void> {
    await this.page.getByRole("link", { name: TEST_COURSE.name }).click();
    await expect(this.page).toHaveURL(URL_PATTERNS.course);
    await this.verifyCourseContent();
  }

  private async verifyCourseContent(): Promise<void> {
    await expect(this.page.getByText(TEST_COURSE.name)).toBeVisible();
    await expect(this.page.getByText(TEST_COURSE.description)).toBeVisible();
  }
}

class PaymentActions {
  constructor(private readonly page: Page) {}

  async fillPaymentForm(expiryYear: number): Promise<void> {
    const stripeFrame = this.page.frameLocator('iframe[title="Secure payment input frame"]');
    await stripeFrame.locator("#Field-numberInput").fill(PAYMENT_DATA.cardNumber);
    await stripeFrame
      .locator("#Field-expiryInput")
      .fill(`${PAYMENT_DATA.expiryMonth}${expiryYear}`);
    await stripeFrame.locator("#Field-cvcInput").fill(PAYMENT_DATA.cvc);
    await expect(this.page.getByText(/Buy for/)).toBeVisible();
  }

  async completePurchase(): Promise<void> {
    await this.page.getByRole("button", { name: /Buy for/ }).click();
  }
}

class EnrollmentActions {
  constructor(private readonly page: Page) {}

  async enrollInCourse(): Promise<void> {
    await this.page.getByRole("button", { name: "Enroll" }).click();
  }

  async unenrollFromCourse(): Promise<void> {
    await this.page.getByRole("button", { name: "Unenroll" }).click();
    await this.page.waitForTimeout(1000);
    await expect(this.page.getByRole("button", { name: /Enroll - / })).toBeVisible();
  }
}

class QuizActions {
  constructor(private readonly page: Page) {}

  async solveQuiz(): Promise<void> {
    await this.page.getByRole("heading", { name: "E2E Testing Quiz" }).click();
    await expect(this.page).toHaveURL(URL_PATTERNS.lesson);

    for (const answer of QUIZ_ANSWERS) {
      const answerButton = this.page.getByRole("button", { name: answer.name });
      const input = answerButton.locator('input[type="checkbox"], input[type="radio"]');
      await answerButton.click();
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
  let paymentActions: PaymentActions;
  let enrollmentActions: EnrollmentActions;
  let quizActions: QuizActions;

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    courseActions = new CourseActions(page);
    paymentActions = new PaymentActions(page);
    enrollmentActions = new EnrollmentActions(page);
    quizActions = new QuizActions(page);
    await courseActions.searchCourse();
  });

  test("should find, open and enroll the paid course", async () => {
    await courseActions.openCourse();
    await enrollmentActions.enrollInCourse();
    await paymentActions.fillPaymentForm(new Date().getFullYear() + 1);
    await paymentActions.completePurchase();
    await enrollmentActions.unenrollFromCourse();
  });

  test("should solve free quiz lesson", async ({ page }) => {
    await courseActions.openCourse();

    await quizActions.solveQuiz();
    await quizActions.checkAndVerifyResults();
    await quizActions.resetQuiz();

    await page.goBack();
  });
});
