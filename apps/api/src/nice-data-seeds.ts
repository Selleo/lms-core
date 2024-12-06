import { faker } from "@faker-js/faker";

import { LESSON_FILE_TYPE, LESSON_ITEM_TYPE, LESSON_TYPE } from "src/lessons/lesson.type";

import { QUESTION_TYPE } from "./questions/schema/questions.types";
import { STATUS } from "./storage/schema/utils";

import type { NiceCourseData } from "./utils/types/test-types";

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
        isFree: false,
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
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            state: STATUS.published.key,
            body: "Learn the basics of web development with HTML! Master the structure and tags needed to build professional websites from scratch.",
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
              {
                optionText: "grid",
                isCorrect: false,
                position: 2,
              },
              {
                optionText: "flex",
                isCorrect: false,
                position: 3,
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
            body: "Learn the basics of web development with HTML! Master the structure and tags needed to build professional websites from scratch.",
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
        isFree: false,
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
              "Which of the following attributes are commonly used with the &lt;img&gt; tag? (Select all that apply)",
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
      {
        type: LESSON_TYPE.quiz.key,
        title: "HTML Basics: Test Your Knowledge",
        description:
          "This lesson is designed to test your understanding of basic HTML concepts. You'll encounter a mix of multiple-choice and single-answer questions to evaluate your knowledge of HTML structure and common elements.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
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
              "Which of the following attributes are commonly used with the &lt;img&gt; tag? (Select all that apply)",
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
            ],
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
      {
        type: LESSON_TYPE.quiz.key,
        title: "CSS Fundamentals: Put Your Skills to the Test",
        description:
          "This lesson is a comprehensive quiz to evaluate your understanding of CSS fundamentals. You'll face a variety of question types covering selectors, properties, and layout techniques.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: true,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "Which CSS property is used to change the text color of an element?",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "color",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "text-color",
                isCorrect: false,
                position: 1,
              },
              {
                optionText: "font-color",
                isCorrect: false,
                position: 2,
              },
              {
                optionText: "text-style",
                isCorrect: false,
                position: 3,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.multiple_choice.key,
            questionBody: "Which of the following are valid CSS selectors? (Select all that apply)",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: ".class-name",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "#id-name",
                isCorrect: true,
                position: 1,
              },
              {
                optionText: "element",
                isCorrect: true,
                position: 2,
              },
              {
                optionText: "[attribute]",
                isCorrect: true,
                position: 3,
              },
              {
                optionText: "$variable",
                isCorrect: false,
                position: 4,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_dnd.key,
            questionBody:
              "The CSS [word] property is used for creating flexible box layouts, while [word] is used for creating grid layouts.",
            state: STATUS.published.key,
            solutionExplanation:
              "<p>The CSS <strong>flexbox</strong> property is used for creating flexible box layouts, while <strong>color properties</strong> are used for creating grid layouts.</p>",
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
              {
                optionText: "grid",
                isCorrect: false,
                position: 2,
              },
              {
                optionText: "flex",
                isCorrect: false,
                position: 3,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody:
              "To center an element horizontally, you can use 'margin: [word] [word];'.",
            state: STATUS.published.key,
            solutionExplanation:
              "<p>To center an element horizontally, you can use 'margin: <strong>0 auto</strong>;'.</p>",
          },
        ],
      },
      {
        type: LESSON_TYPE.multimedia.key,
        title: "JavaScript Basics: Interactive Learning",
        description:
          "This multimedia lesson introduces you to JavaScript basics through a combination of video tutorials, interactive code examples, and hands-on exercises.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: true,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            type: LESSON_FILE_TYPE.external_video.key,
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            title: "Introduction to JavaScript",
            state: STATUS.published.key,
            body: "Learn the basics of web development with HTML! Master the structure and tags needed to build professional websites from scratch.",
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.open_answer.key,
            questionBody:
              "Your First JavaScript Function // Write a function to add two numbers\nfunction add(a, b) {\n  // Your code here\n}",
            solutionExplanation: "function add(a, b) {\n  return a + b;\n}",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            url: "https://example.com/javascript-data-types-image",
            title: "JavaScript Data Types Overview",
            state: STATUS.published.key,
            type: LESSON_FILE_TYPE.presentation.key,
            body: "Learn the basics of web development with HTML! Master the structure and tags needed to build professional websites from scratch.",
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "Which keyword is used to declare a variable in modern JavaScript?",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "let",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "var",
                isCorrect: false,
                position: 1,
              },
              {
                optionText: "const",
                isCorrect: false,
                position: 2,
              },
              {
                optionText: "variable",
                isCorrect: false,
                position: 3,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Mobile App Development: Creating Your First Android App",
    description:
      "Dive into the world of mobile app development with this beginner-friendly course. You'll learn the fundamentals of Android app development using Java and Android Studio. By the end of the course, you'll have created your own simple Android app and gained essential skills for future mobile development projects.",
    state: STATUS.published.key,
    priceInCents: 0,
    category: "Mobile Development",
    imageUrl: faker.image.urlPicsumPhotos(),
    lessons: [
      {
        type: LESSON_TYPE.multimedia.key,
        title: "Java Basics: Building Blocks of Android Development",
        description:
          "This lesson introduces you to Java programming fundamentals essential for Android development. We'll cover basic syntax, object-oriented programming concepts, and how Java is used in Android app creation.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Introduction to Java for Android",
            body: "Java is the primary language used for Android app development. In this lesson, you'll learn about Java syntax, data types, and object-oriented programming principles that form the foundation of Android development.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.open_answer.key,
            questionBody:
              "Explain why Java is the preferred language for Android development and list two key features that make it suitable for mobile app creation.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            title: "Java Basics Video Tutorial",
            type: LESSON_FILE_TYPE.external_video.key,
            url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            state: STATUS.published.key,
            body: "Learn the basics of web development with HTML! Master the structure and tags needed to build professional websites from scratch.",
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody:
              "In Java, [word] are used to define the blueprint of objects, while [word] are instances of these blueprints.",
            state: STATUS.published.key,
            solutionExplanation:
              "<p>In Java, <strong>classes</strong> are used to define the blueprint of objects, while <strong>objects</strong> are instances of these blueprints.</p>",
            questionAnswers: [
              {
                optionText: "classes",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "objects",
                isCorrect: true,
                position: 1,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody:
              "In Android development, [word] are used to define the user interface, while [word] handle user interactions and app logic.",
            state: STATUS.published.key,
            solutionExplanation:
              "<p>In Android development, <strong>layouts</strong> are used to define the user interface, while <strong>activities</strong> handle user interactions and app logic.</p>",
            questionAnswers: [
              {
                optionText: "layouts",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "activities",
                isCorrect: true,
                position: 1,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_dnd.key,
            questionBody:
              "Java uses [word] to handle errors, while Android Studio provides [word] for efficient code writing and debugging.",
            state: STATUS.published.key,
            solutionExplanation:
              "<p>Java uses <strong>exceptions</strong> to handle errors, while Android Studio provides <strong>tools</strong> for efficient code writing and debugging.</p>",
            questionAnswers: [
              {
                optionText: "exceptions",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "tools",
                isCorrect: true,
                position: 1,
              },
              {
                optionText: "debuggers",
                isCorrect: false,
                position: 2,
              },
              {
                optionText: "libraries",
                isCorrect: false,
                position: 3,
              },
              {
                optionText: "frameworks",
                isCorrect: false,
                position: 4,
              },
              {
                optionText: "emulators",
                isCorrect: false,
                position: 5,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            title: "Java OOP Concepts Presentation",
            type: LESSON_FILE_TYPE.external_presentation.key,
            url: "https://res.cloudinary.com/dinpapxzv/raw/upload/v1727104719/presentation_gp0o3d.pptx",
            state: STATUS.published.key,
            body: "Learn the basics of web development with HTML! Master the structure and tags needed to build professional websites from scratch.",
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "Which keyword is used to create a new instance of a class in Java?",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "new",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "create",
                isCorrect: false,
                position: 1,
              },
              {
                optionText: "instance",
                isCorrect: false,
                position: 2,
              },
              {
                optionText: "object",
                isCorrect: false,
                position: 3,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.multiple_choice.key,
            questionBody:
              "Which of the following are core principles of Object-Oriented Programming in Java? Select all that apply.",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "Encapsulation",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "Inheritance",
                isCorrect: true,
                position: 1,
              },
              {
                optionText: "Polymorphism",
                isCorrect: true,
                position: 2,
              },
              {
                optionText: "Abstraction",
                isCorrect: true,
                position: 3,
              },
              {
                optionText: "Compilation",
                isCorrect: false,
                position: 4,
              },
              {
                optionText: "Interpretation",
                isCorrect: false,
                position: 5,
              },
            ],
          },
        ],
      },
      {
        type: LESSON_TYPE.quiz.key,
        title: "Android Development Basics: Test Your Knowledge",
        description:
          "This quiz is designed to test your understanding of Android development fundamentals. You'll encounter a variety of questions covering Java basics, Android components, and app structure.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "Which of the following is the entry point of an Android application?",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "Activity",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "Service",
                isCorrect: false,
                position: 1,
              },
              {
                optionText: "BroadcastReceiver",
                isCorrect: false,
                position: 2,
              },
              {
                optionText: "ContentProvider",
                isCorrect: false,
                position: 3,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.multiple_choice.key,
            questionBody:
              "Which of the following are valid Android app components? (Select all that apply)",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "Activity",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "Service",
                isCorrect: true,
                position: 1,
              },
              {
                optionText: "BroadcastReceiver",
                isCorrect: true,
                position: 2,
              },
              {
                optionText: "ContentProvider",
                isCorrect: true,
                position: 3,
              },
              {
                optionText: "Fragment",
                isCorrect: false,
                position: 4,
              },
              {
                optionText: "Intent",
                isCorrect: false,
                position: 5,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody:
              "Which file in an Android project defines the app's structure and components?",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "AndroidManifest.xml",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "build.gradle",
                isCorrect: false,
                position: 1,
              },
              {
                optionText: "strings.xml",
                isCorrect: false,
                position: 2,
              },
              {
                optionText: "R.java",
                isCorrect: false,
                position: 3,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.multiple_choice.key,
            questionBody:
              "Which of the following are used for defining the user interface in Android? (Select all that apply)",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "XML layouts",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "Java code",
                isCorrect: true,
                position: 1,
              },
              {
                optionText: "Kotlin code",
                isCorrect: true,
                position: 2,
              },
              {
                optionText: "HTML",
                isCorrect: false,
                position: 3,
              },
              {
                optionText: "CSS",
                isCorrect: false,
                position: 4,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_dnd.key,
            questionBody:
              "In Android, [word] are used to start new screens, while [word] are used to perform background tasks.",
            state: STATUS.published.key,
            solutionExplanation:
              "<p>In Android, <strong>Activities</strong> are used to start new screens, while <strong>Services</strong> are used to perform background tasks.</p>",
            questionAnswers: [
              {
                optionText: "Activities",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "Services",
                isCorrect: true,
                position: 1,
              },
              {
                optionText: "Intents",
                isCorrect: false,
                position: 2,
              },
              {
                optionText: "Fragments",
                isCorrect: false,
                position: 3,
              },
              {
                optionText: "Layouts",
                isCorrect: false,
                position: 4,
              },
              {
                optionText: "Threads",
                isCorrect: false,
                position: 5,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody:
              "In Android Studio, the [word] tool is used to create and preview layouts, while the [word] tool is used to test apps on different device configurations.",
            state: STATUS.published.key,
            solutionExplanation:
              "<p>In Android Studio, the <strong>Layout Editor</strong> tool is used to create and preview layouts, while the <strong>Emulator</strong> tool is used to test apps on different device configurations.</p>",
            questionAnswers: [
              {
                optionText: "Layout Editor",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "Emulator",
                isCorrect: true,
                position: 1,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody:
              "In Android, [word] are used to store app data persistently, while [word] are used for temporary data storage.",
            state: STATUS.published.key,
            solutionExplanation:
              "<p>In Android, <strong>SharedPreferences</strong> are used to store app data persistently, while <strong>Bundle</strong> objects are used for temporary data storage.</p>",
            questionAnswers: [
              {
                optionText: "SharedPreferences",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "Bundle",
                isCorrect: true,
                position: 1,
              },
            ],
          },
        ],
      },
    ],
  },
];
