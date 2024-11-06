import { faker } from "@faker-js/faker";

import type { Status } from "./storage/schema/utils";

export const LessonFileType = {
  presentation: "Presentation",
  external_presentation: "External Presentation",
  video: "Video",
  external_video: "External Video",
} as const;

export const QuestionType = {
  open_answer: "Open Answer",
  single_choice: "Single Choice",
  multiple_choice: "Multiple Choice",
  fill_in_the_blanks_text: "Fill in the blanks",
  fill_in_the_blanks_dnd: "Fill in the blanks",
} as const;

export interface NiceCourseData {
  title: string;
  description: string;
  imageUrl?: string;
  state: keyof typeof Status;
  priceInCents: number;
  category: string;
  lessons: {
    type: "quiz" | "multimedia";
    title: string;
    description: string;
    state: keyof typeof Status;
    items: Array<
      | {
          type: "text_block";
          title: string;
          body: string;
          state: keyof typeof Status;
        }
      | {
          type: "file";
          title: string;
          fileType: keyof typeof LessonFileType;
          url: string;
          state: keyof typeof Status;
        }
      | {
          type: "question";
          questionType: keyof typeof QuestionType;
          questionBody: string;
          state: keyof typeof Status;
        }
    >;
  }[];
}

export const niceCourses: NiceCourseData[] = [
  {
    title: "Introduction to Web Development: Building Your First Website",
    description:
      "In this beginner-friendly course, you will learn the basics of web development. We will guide you through creating a simple website from scratch using HTML, CSS, and a bit of JavaScript. No prior experience is needed—just a willingness to learn! By the end of the course, you’ll have built your own website and gained essential skills for further web development projects.",
    state: "published",
    priceInCents: 9900,
    category: "Web Development",
    imageUrl: faker.image.urlPicsumPhotos(),
    lessons: [
      {
        type: "multimedia",
        title: "HTML Basics: Building the Structure of Your Website",
        description:
          "In this lesson, you will learn how to use HTML to create the basic structure of a website. We'll cover common HTML elements such as headings, paragraphs, links, and images, helping you understand how to build a solid foundation for your web pages.",
        state: "published",
        items: [
          {
            type: "text_block",
            title: "Introduction to HTML",
            body: "HTML (HyperText Markup Language) is the standard language used to create the structure of web pages. In this lesson, you'll explore basic HTML elements and how they are used to build the framework of a website.",
            state: "published",
          },
          {
            type: "question",
            questionType: "open_answer",
            questionBody:
              "Why is HTML considered the backbone of any website? Explain its role in web development.",
            state: "published",
          },
          {
            type: "file",
            title: "HTML Elements Video",
            fileType: "external_video",
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            state: "published",
          },
          {
            type: "question",
            questionType: "fill_in_the_blanks_text",
            questionBody:
              "Fill in the blanks: The <h1> tag is used for [word], while the <p> tag is used for [word].",
            state: "published",
          },
          {
            type: "question",
            questionType: "fill_in_the_blanks_dnd",
            questionBody:
              "CSS is used to style [word], while JavaScript is used to add [word] to web pages.",
            state: "published",
          },
          {
            type: "file",
            title: "HTML Hyperlinks Presentation",
            fileType: "external_presentation",
            url: "https://res.cloudinary.com/dinpapxzv/raw/upload/v1727104719/presentation_gp0o3d.pptx",
            state: "published",
          },
          {
            type: "question",
            questionType: "single_choice",
            questionBody: "Which of the following HTML tags is used to create a hyperlink?",
            state: "published",
          },
          {
            type: "question",
            questionType: "multiple_choice",
            questionBody:
              "Which HTML elements would you use to create a well-structured web page? Select all that apply.",
            state: "published",
          },
        ],
      },
      {
        type: "quiz",
        title: "HTML Basics: Test Your Knowledge",
        description:
          "This lesson is designed to test your understanding of basic HTML concepts. You'll encounter a mix of multiple-choice and single-answer questions to evaluate your knowledge of HTML structure and common elements.",
        state: "published",
        items: [
          {
            type: "question",
            questionType: "single_choice",
            questionBody: "Which of the following HTML tags is used to create an image?",
            state: "published",
          },
          {
            type: "question",
            questionType: "multiple_choice",
            questionBody:
              "Which of the following are valid HTML elements for structuring content? (Select all that apply)",
            state: "published",
          },
          {
            type: "question",
            questionType: "single_choice",
            questionBody: "Which HTML tag is used to create a hyperlink?",
            state: "published",
          },
          {
            type: "question",
            questionType: "multiple_choice",
            questionBody:
              "Which of the following attributes are commonly used with the <img> tag? (Select all that apply)",
            state: "published",
          },
          {
            type: "question",
            questionType: "fill_in_the_blanks_text",
            questionBody:
              "Fill in the blanks: The <h1> tag is used for [word], while the <p> tag is used for [word].",
            state: "published",
          },
          {
            type: "question",
            questionType: "fill_in_the_blanks_dnd",
            questionBody:
              "CSS is used to style [word], while JavaScript is used to add [word] to web pages.",
            state: "published",
          },
        ],
      },
    ],
  },
];
