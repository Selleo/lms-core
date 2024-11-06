import { faker } from "@faker-js/faker";
import { STATUS } from "./storage/schema/utils";
import {
  QUESTION_TYPE,
  QUESTION_TYPE_KEYS,
} from "./questions/schema/questions.types";
import {
  LESSON_FILE_TYPE,
  LESSON_ITEM_TYPE,
  LESSON_TYPE,
} from "./lessons/lessonFileType";

export interface NiceCourseData {
  title: string;
  description: string;
  imageUrl?: string;
  state: keyof typeof STATUS;
  priceInCents: number;
  category: string;
  lessons: {
    type: keyof typeof LESSON_TYPE;
    title: string;
    description: string;
    state: keyof typeof STATUS;
    items: Array<
      | {
          type: typeof LESSON_ITEM_TYPE.text_block.key;
          title: string;
          body: string;
          state: keyof typeof STATUS;
        }
      | {
          type: typeof LESSON_ITEM_TYPE.file.key;
          title: string;
          fileType: keyof typeof LESSON_FILE_TYPE;
          url: string;
          state: keyof typeof STATUS;
        }
      | {
          type: typeof LESSON_ITEM_TYPE.question.key;
          questionType: keyof typeof QUESTION_TYPE_KEYS;
          questionBody: string;
          state: keyof typeof STATUS;
        }
    >;
  }[];
}

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
        items: [
          {
            type: LESSON_ITEM_TYPE.text_block.key,
            title: "Introduction to HTML",
            body: "HTML (HyperText Markup Language) is the standard language used to create the structure of web pages. In this lesson, you'll explore basic HTML elements and how they are used to build the framework of a website.",
            state: STATUS.published.key,
          },
          {
            type: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.open_answer.key,
            questionBody:
              "Why is HTML considered the backbone of any website? Explain its role in web development.",
            state: STATUS.published.key,
          },
          {
            type: LESSON_ITEM_TYPE.file.key,
            title: "HTML Elements Video",
            fileType: LESSON_FILE_TYPE.external_video.key,
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            state: STATUS.published.key,
          },
          {
            type: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody:
              "Fill in the blanks: The <h1> tag is used for [word], while the <p> tag is used for [word].",
            state: STATUS.published.key,
          },
          {
            type: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_dnd.key,
            questionBody:
              "CSS is used to style [word], while JavaScript is used to add [word] to web pages.",
            state: STATUS.published.key,
          },
          {
            type: LESSON_ITEM_TYPE.file.key,
            title: "HTML Hyperlinks Presentation",
            fileType: LESSON_FILE_TYPE.external_presentation.key,
            url: "https://res.cloudinary.com/dinpapxzv/raw/upload/v1727104719/presentation_gp0o3d.pptx",
            state: STATUS.published.key,
          },
          {
            type: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody:
              "Which of the following HTML tags is used to create a hyperlink?",
            state: STATUS.published.key,
          },
          {
            type: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.multiple_choice.key,
            questionBody:
              "Which HTML elements would you use to create a well-structured web page? Select all that apply.",
            state: STATUS.published.key,
          },
        ],
      },
      {
        type: LESSON_TYPE.quiz.key,
        title: "HTML Basics: Test Your Knowledge",
        description:
          "This lesson is designed to test your understanding of basic HTML concepts. You'll encounter a mix of multiple-choice and single-answer questions to evaluate your knowledge of HTML structure and common elements.",
        state: STATUS.published.key,
        items: [
          {
            type: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody:
              "Which of the following HTML tags is used to create an image?",
            state: STATUS.published.key,
          },
          {
            type: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.multiple_choice.key,
            questionBody:
              "Which of the following are valid HTML elements for structuring content? (Select all that apply)",
            state: STATUS.published.key,
          },
          {
            type: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "Which HTML tag is used to create a hyperlink?",
            state: STATUS.published.key,
          },
          {
            type: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.multiple_choice.key,
            questionBody:
              "Which of the following attributes are commonly used with the <img> tag? (Select all that apply)",
            state: STATUS.published.key,
          },
          {
            type: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody:
              "Fill in the blanks: The <h1> tag is used for [word], while the <p> tag is used for [word].",
            state: STATUS.published.key,
          },
          {
            type: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_dnd.key,
            questionBody:
              "CSS is used to style [word], while JavaScript is used to add [word] to web pages.",
            state: STATUS.published.key,
          },
        ],
      },
    ],
  },
];
