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
    await page.keyboard.type(lessonDescription, { delay: 5 });
    await expect(editorInput).toHaveText(lessonDescription);
    await page.getByRole("button", { name: /save/i }).click();
  }

  async addQuiz(page: Page, chapterLocator: Locator): Promise<void> {
    await chapterLocator.getByRole("button", { name: /add lesson/i }).click();
    const buttonWithText = await page.locator('h3:has-text("Quiz")');
    const lessonButton = buttonWithText.locator("..");
    await lessonButton.click();
    await page.getByLabel("Title").fill("Quiz for first exam");
  }

  async addQuestion(
    page: Page,
    questionType: string,
    questionTitle: string,
    questionIndex: number,
  ): Promise<void> {
    await expect(page.getByRole("button", { name: /add question/i })).toBeVisible();
    await page.getByRole("button", { name: /add question/i }).click();
    await expect(page.getByRole("button", { name: new RegExp(questionType, "i") })).toBeVisible();
    await page.getByRole("button", { name: new RegExp(questionType, "i") }).click();
    await page.locator(`input[name="questions.${questionIndex}.title"]`).fill(questionTitle);
  }

  async addOptionsAndFillAnswerQuestion(
    questionIndex: number,
    options: { text: string; isCorrect: boolean }[],
    multipleChoice: boolean = false,
  ): Promise<void> {
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      const optionTextLocator = `input[name="questions.${questionIndex}.options.${i}.optionText"]`;
      const optionIsCorrectLocator = `input[name="questions.${questionIndex}.options.${i}.isCorrect"]`;

      await this.page.locator(optionTextLocator).fill(option.text);

      if (option.isCorrect) {
        if (multipleChoice) {
          await this.page.locator(optionIsCorrectLocator).locator("..").locator("button").click();
        } else {
          await this.page.locator(optionIsCorrectLocator).click();
        }
      }

      if (i >= 1 && i < options.length - 1) {
        await this.page.getByTestId(`add-options-button-${questionIndex}`).click();
      }
    }
  }
  async addTrueOrFalseQuestion(
    page: Page,
    questionIndex: number,
    correctAnswerIndex: number,
  ): Promise<void> {
    await page.getByTestId(`add-options-button-${questionIndex}`).click();
    await page.getByTestId(`add-options-button-${questionIndex}`).click();

    const options = [
      "CSS allows direct manipulation of a website's database.",
      "CSS enables styling HTML elements, such as colors, fonts, and page layouts.",
      "CSS only works in web browsers that support JavaScript.",
    ];

    for (let i = 0; i < options.length; i++) {
      await page
        .locator(`input[name="questions.${questionIndex}.options.${i}.optionText"]`)
        .fill(options[i]);
    }
    await page
      .locator(`input[name="questions.${questionIndex}.options.${correctAnswerIndex}.isCorrect"]`)
      .first()
      .click();
  }
  async addMatchingQuestion(
    page: Page,
    questionIndex: number,
    options: { optionText: string; matchedWord: string }[],
  ): Promise<void> {
    await page.getByTestId(`add-options-button-${questionIndex}`).click();

    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      await page
        .locator(`input[name="questions.${questionIndex}.options.${i}.optionText"]`)
        .fill(option.optionText);
      await page
        .locator(`input[name="questions.${questionIndex}.options.${i}.matchedWord"]`)
        .fill(option.matchedWord);
    }
  }
  async addScaleQuestion(page: Page, questionIndex: number, options: string[]): Promise<void> {
    await page.getByTestId(`add-options-button-${questionIndex}`).click();
    await page.getByTestId(`add-options-button-${questionIndex}`).click();

    for (let i = 0; i < options.length; i++) {
      await page
        .locator(`input[name="questions.${questionIndex}.options.${i}.optionText"]`)
        .fill(options[i]);
    }
  }
  async addPhotoQuestion(
    page: Page,
    questionIndex: number,
    imagePath: string,
    options: string[],
    correctOptionIndex: number,
  ): Promise<void> {
    await page.getByTestId(`add-options-button-${questionIndex}`).click();

    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(imagePath);

    for (let i = 0; i < options.length; i++) {
      await page
        .locator(`input[name="questions.${questionIndex}.options.${i}.optionText"]`)
        .fill(options[i]);
    }

    await page
      .locator(`input[name="questions.${questionIndex}.options.${correctOptionIndex}.isCorrect"]`)
      .click();
  }

  async addFillInTheBlankQuestion(page: Page, word: string) {
    await page.getByRole("button", { name: /add words/i }).click();

    await page.locator('[data-testid="new-word-input"]').fill(word);

    await page.locator('[data-testid="add-word"]').click();

    const draggableElement = page.locator(`span:text("${word}")`).locator("..");
    await draggableElement.waitFor({ state: "visible" });

    const editableElement = page.locator('div[contenteditable="true"]');
    await editableElement.click();

    await page.keyboard.type(
      "The most popular programing language used to styling components is ",
      { delay: 5 },
    );

    await draggableElement.dragTo(editableElement);
    await expect(editableElement).toContainText(word);
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

    await createCourseActions.addQuiz(page, chapterLocator);

    await createCourseActions.addQuestion(
      page,
      "free text",
      "Describe what is your CSS and HTML level",
      0,
    );
    await createCourseActions.addQuestion(
      page,
      "short answer",
      "Describe what would you like to learn with this course",
      1,
    );

    await createCourseActions.addQuestion(
      page,
      "single choice",
      "Which css tag is most popular, choose one correct answer",
      2,
    );
    await createCourseActions.addOptionsAndFillAnswerQuestion(2, [
      { text: "<div></div>", isCorrect: true },
      { text: "<p></p>", isCorrect: false },
      { text: "<h1></h1>", isCorrect: false },
    ]);

    await createCourseActions.addQuestion(
      page,
      "multiple choice",
      "Which of the following are valid CSS properties?",
      3,
    );
    await createCourseActions.addOptionsAndFillAnswerQuestion(
      3,
      [
        { text: "color", isCorrect: true },
        { text: "font-size", isCorrect: true },
        { text: "text-align-center", isCorrect: false },
        { text: "background-image-url", isCorrect: false },
      ],
      true,
    );

    await createCourseActions.addQuestion(
      page,
      "true or false",
      "Which of the following statements about CSS are true?",
      4,
    );
    await createCourseActions.addTrueOrFalseQuestion(page, 4, 1);

    await createCourseActions.addQuestion(
      page,
      "matching",
      "Match the CSS property with its effect",
      5,
    );
    const matchingOptions = [
      { optionText: "Affects the spacing inside an element.", matchedWord: "Padding" },
      {
        optionText: "Defines how an element is positioned relative to its container.",
        matchedWord: "Position",
      },
      { optionText: "Adds shadow effects to an element.", matchedWord: "Box shadow" },
    ];
    await createCourseActions.addMatchingQuestion(page, 5, matchingOptions);

    await createCourseActions.addQuestion(
      page,
      "scale 1 to 5",
      "How would you rate your CSS knowledge on a scale from 1 to 5?",
      6,
    );
    const scaleOptions = [
      "Beginner (I have basic knowledge and am still learning CSS)",
      "Intermediate (I understand the basics but am still learning more advanced techniques)",
      "Expert (I have advanced knowledge and can create complex styles)",
    ];
    await createCourseActions.addScaleQuestion(page, 6, scaleOptions);

    await createCourseActions.addQuestion(
      page,
      "photo question",
      "What code language do you see on this screenshot",
      7,
    );
    const photoOptions = ["JAVA", "PYTHON", "JAVASCRIPT"];
    const imagePath = "app/assets/thumbnail-e2e.jpg";
    await createCourseActions.addPhotoQuestion(page, 7, imagePath, photoOptions, 2);

    // await createCourseActions.addQuestion(
    //   page,
    //   "fill in the blanks",
    //   "Fill words in blank space",
    //   8,
    // );
    // await createCourseActions.addFillInTheBlankQuestion(page, "CSS");

    await page.getByRole("button", { name: /save/i }).click();
    const quizLocator = chapterLocator.locator('div[aria-label="Lesson: Quiz for first exam"]');
    await expect(quizLocator).toBeVisible();
  });

  test("should check if course occurs on course list", async () => {
    await createCourseActions.openCourse(newCourseId);

    await createCourseActions.verifyCoursePage(page, newCourseId, expectedTitle);
  });
});
