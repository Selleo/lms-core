import { faker } from "@faker-js/faker";
import { Type } from "@sinclair/typebox";

import { baseCourseSchema } from "src/courses/schemas/createCourse.schema";
import { LESSON_FILE_TYPE, LESSON_ITEM_TYPE, LESSON_TYPE } from "src/lessons/lesson.type";
import { lesson } from "src/lessons/schemas/lesson.schema";
import {
  lessonItemFileSchema,
  questionAnswerOptionsSchema,
  questionSchema,
  textBlockSchema,
} from "src/lessons/schemas/lessonItem.schema";

import { QUESTION_TYPE } from "../../questions/schema/questions.types";
import { STATUS } from "../schema/utils";

import type { Static } from "@sinclair/typebox";

const niceCourseData = Type.Intersect([
  Type.Omit(baseCourseSchema, ["categoryId"]),
  Type.Object({
    category: Type.String(),
    lessons: Type.Array(
      Type.Intersect([
        Type.Omit(lesson, ["id"]),
        Type.Object({
          state: Type.Union([Type.Literal(STATUS.draft.key), Type.Literal(STATUS.published.key)]),
          items: Type.Array(
            Type.Union([
              Type.Intersect([
                Type.Omit(lessonItemFileSchema, ["id", "archived", "authorId"]),
                Type.Object({
                  itemType: Type.Literal(LESSON_ITEM_TYPE.file.key),
                }),
              ]),
              Type.Intersect([
                Type.Omit(textBlockSchema, ["id", "archived", "authorId"]),
                Type.Object({
                  itemType: Type.Literal(LESSON_ITEM_TYPE.text_block.key),
                }),
              ]),
              Type.Intersect([
                Type.Omit(questionSchema, ["id", "archived", "authorId", "questionAnswers"]),
                Type.Object({
                  itemType: Type.Literal(LESSON_ITEM_TYPE.question.key),
                  questionAnswers: Type.Optional(
                    Type.Array(Type.Omit(questionAnswerOptionsSchema, ["id", "questionId"])),
                  ),
                }),
              ]),
            ]),
          ),
        }),
      ]),
    ),
  }),
]);

type NiceCourseData = Static<typeof niceCourseData>;

export const niceCourses: NiceCourseData[] = [
  {
    title: "Introduction to Web Development: Building Your First Website",
    description:
      "In this beginner-friendly course, you will learn the basics of web development. We will guide you through creating a simple website from scratch using HTML, CSS, and a bit of JavaScript. No prior experience is needed—just a willingness to learn! By the end of the course, you’ll have built your own website and gained essential skills for further web development projects.",
    state: STATUS.published.key,
    priceInCents: 9900,
    category: "Web Development",
    imageUrl: faker.image.urlPicsumPhotos(),
    lessons: [
      {
        type: LESSON_TYPE.multimedia.key,
        title: "HTML Basics: Building the Structure of Your Website",
        description:
          "In this lesson, you will learn how to use HTML to create the basic structure of a website. We'll cover common HTML elements such as headings, paragraphs, links, and images, helping you understand how to build a solid foundation for your web pages.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        items: [
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Introduction to HTML",
            body: "HTML (HyperText Markup Language) is the standard language used to create the structure of web pages. In this lesson, you'll explore basic HTML elements and how they are used to build the framework of a website.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.open_answer.key,
            questionBody:
              "Why is HTML considered the backbone of any website? Explain its role in web development.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            title: "HTML Elements Video",
            type: LESSON_FILE_TYPE.external_video.key,
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody:
              "In CSS, [word] is used to style the layout, while [word] is used to change colors.",
            state: STATUS.published.key,
            solutionExplanation:
              "<p>In CSS, <strong>flexbox</strong> is used to style the layout, while <strong>color properties</strong> are used to change colors.</p>",
            questionAnswers: [
              {
                optionText: "flexbox",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "color properties",
                isCorrect: true,
                position: 1,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody:
              "In JavaScript, [word] are used to store data, while [word] are used to perform actions.",
            state: STATUS.published.key,
            solutionExplanation:
              "<p>In JavaScript, <strong>variables</strong> are used to store data, while <strong>functions</strong> are used to perform actions.</p>",
            questionAnswers: [
              {
                optionText: "variables",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "functions",
                isCorrect: true,
                position: 1,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_dnd.key,
            questionBody:
              "CSS is used to style [word], while JavaScript is used to add [word] to web pages.",
            state: STATUS.published.key,
            solutionExplanation:
              "<p>CSS is used to style <strong>HTML</strong>, while JavaScript is used to add <strong>interactivity</strong> to web pages.</p>",
            questionAnswers: [
              {
                optionText: "HTML",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "interactivity",
                isCorrect: true,
                position: 1,
              },
              {
                optionText: "styles",
                isCorrect: false,
                position: 2,
              },
              {
                optionText: "functions",
                isCorrect: false,
                position: 3,
              },
              {
                optionText: "content",
                isCorrect: false,
                position: 4,
              },
              {
                optionText: "elements",
                isCorrect: false,
                position: 5,
              },
              {
                optionText: "animations",
                isCorrect: false,
                position: 6,
              },
              {
                optionText: "design",
                isCorrect: false,
                position: 7,
              },
              {
                optionText: "validation",
                isCorrect: false,
                position: 8,
              },
              {
                optionText: "databases",
                isCorrect: false,
                position: 9,
              },
              {
                optionText: "forms",
                isCorrect: false,
                position: 10,
              },
              {
                optionText: "structure",
                isCorrect: false,
                position: 11,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            title: "HTML Hyperlinks Presentation",
            type: LESSON_FILE_TYPE.external_presentation.key,
            url: "https://res.cloudinary.com/dinpapxzv/raw/upload/v1727104719/presentation_gp0o3d.pptx",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "Which HTML tag is used to create a hyperlink?",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "<a>",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "<link>",
                isCorrect: false,
                position: 1,
              },
              {
                optionText: "<button>",
                isCorrect: false,
                position: 2,
              },
              {
                optionText: "<input>",
                isCorrect: false,
                position: 3,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.multiple_choice.key,
            questionBody:
              "Which HTML elements would you use to create a well-structured web page? Select all that apply.",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "<html>",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "<head>",
                isCorrect: true,
                position: 1,
              },
              {
                optionText: "<body>",
                isCorrect: true,
                position: 2,
              },
              {
                optionText: "<title>",
                isCorrect: true,
                position: 3,
              },
              {
                optionText: "<h1>",
                isCorrect: false,
                position: 4,
              },
              {
                optionText: "<p>",
                isCorrect: false,
                position: 5,
              },
              {
                optionText: "<div>",
                isCorrect: false,
                position: 6,
              },
            ],
          },
        ],
      },
      {
        type: LESSON_TYPE.quiz.key,
        title: "HTML Basics: Test Your Knowledge",
        description:
          "This lesson is designed to test your understanding of basic HTML concepts. You'll encounter a mix of multiple-choice and single-answer questions to evaluate your knowledge of HTML structure and common elements.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        items: [
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "Which of the following HTML tags is used to create an image?",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "<img>",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "<picture>",
                isCorrect: false,
                position: 1,
              },
              {
                optionText: "<video>",
                isCorrect: false,
                position: 2,
              },
              {
                optionText: "<audio>",
                isCorrect: false,
                position: 3,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.multiple_choice.key,
            questionBody:
              "Which of the following are valid HTML elements for structuring content? (Select all that apply)",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "<html>",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "<head>",
                isCorrect: true,
                position: 1,
              },
              {
                optionText: "<body>",
                isCorrect: true,
                position: 2,
              },
              {
                optionText: "<title>",
                isCorrect: true,
                position: 3,
              },
              {
                optionText: "<h1>",
                isCorrect: false,
                position: 4,
              },
              {
                optionText: "<p>",
                isCorrect: false,
                position: 5,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "Which HTML tag is used to create a hyperlink?",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.multiple_choice.key,
            questionBody:
              "Which of the following attributes are commonly used with the <img> tag? (Select all that apply)",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "alt",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "src",
                isCorrect: true,
                position: 1,
              },
              {
                optionText: "width",
                isCorrect: false,
                position: 2,
              },
              {
                optionText: "height",
                isCorrect: false,
                position: 3,
              },
              {
                optionText: "srcset",
                isCorrect: false,
                position: 4,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_dnd.key,
            questionBody:
              "CSS is used to style [word], while JavaScript is used to add [word] to web pages.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody:
              "In CSS, [word] is used to style the layout, while [word] is used to change colors.",
            state: STATUS.published.key,
            solutionExplanation:
              "<p>In CSS, <strong>flexbox</strong> is used to style the layout, while <strong>color properties</strong> are used to change colors.</p>",
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody:
              "In JavaScript, [word] are used to store data, while [word] are used to perform actions.",
            state: STATUS.published.key,
            solutionExplanation:
              "<p>In JavaScript, <strong>variables</strong> are used to store data, while <strong>functions</strong> are used to perform actions.</p>",
          },
        ],
      },
    ],
  },
];
