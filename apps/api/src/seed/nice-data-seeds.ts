import { faker } from "@faker-js/faker";

import { LESSON_FILE_TYPE, LESSON_ITEM_TYPE, LESSON_TYPE } from "src/lessons/lesson.type";

import { QUESTION_TYPE } from "../questions/schema/questions.types";
import { STATUS } from "../storage/schema/utils";

import type { NiceCourseData } from "../utils/types/test-types";

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
            title: "Introduction to JavaScript",
            state: STATUS.published.key,
            body: "Learn the basics of web development with HTML! Master the structure and tags needed to build professional websites from scratch.",
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.open_answer.key,
            questionBody:
              "Your First JavaScript Function.  Write a function to add two numbers\nfunction add(a, b)",
            solutionExplanation: "function add(a, b) {\n  return a + b;\n}",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
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
  {
    title: "Kotlin for Beginners: Modern Android Development",
    description:
      "Explore Kotlin, the modern and preferred language for Android development. This beginner-friendly course introduces Kotlin fundamentals and guides you through creating a basic Android app using Kotlin and Android Studio.",
    state: STATUS.published.key,
    priceInCents: 0,
    category: "Mobile Development",
    imageUrl: faker.image.urlPicsumPhotos(),
    lessons: [
      {
        type: LESSON_TYPE.multimedia.key,
        title: "Getting Started with Kotlin Programming",
        description:
          "Learn Kotlin basics, including syntax, data types, and object-oriented programming concepts.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Introduction to Kotlin for Android",
            body: "Kotlin is a modern, concise language used for Android development. In this lesson, you'll learn about Kotlin syntax and basic concepts for creating Android apps.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            title: "Kotlin Basics Video Tutorial",
            type: LESSON_FILE_TYPE.external_video.key,
            state: STATUS.published.key,
            body: "A video tutorial to help you learn Kotlin syntax, object-oriented principles, and how to apply them to Android development.",
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "Which keyword is used to declare a variable in Kotlin?",
            state: STATUS.published.key,
            questionAnswers: [
              { optionText: "var", isCorrect: true, position: 0 },
              { optionText: "val", isCorrect: false, position: 1 },
              { optionText: "let", isCorrect: false, position: 2 },
              { optionText: "data", isCorrect: false, position: 3 },
            ],
          },
        ],
      },
      {
        type: LESSON_TYPE.multimedia.key,
        title: "Building Your First App with Kotlin",
        description: "Create a simple Android app using Kotlin and Android Studio.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Setting Up Your Android Studio Environment",
            body: "Learn how to configure Android Studio for Kotlin development and create your first Android project.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            title: "Creating a Simple Kotlin App",
            type: LESSON_FILE_TYPE.external_presentation.key,
            state: STATUS.published.key,
            body: "A step-by-step guide to building your first Android app using Kotlin.",
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody:
              "In Kotlin, [word] are immutable variables, while [word] are mutable variables.",
            state: STATUS.published.key,
            solutionExplanation:
              "<p>In Kotlin, <strong>val</strong> are immutable variables, while <strong>var</strong> are mutable variables.</p>",
            questionAnswers: [
              { optionText: "val", isCorrect: true, position: 0 },
              { optionText: "var", isCorrect: true, position: 1 },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Mathematics for Beginners: Building a Strong Foundation",
    description:
      "Learn essential math concepts with this beginner-friendly course. Covering fundamental topics like arithmetic, geometry, and algebra, this course is designed to make math accessible and enjoyable. By the end, you'll have a solid understanding of foundational math skills needed for advanced learning.",
    state: STATUS.published.key,
    priceInCents: 0,
    category: "Mathematics",
    imageUrl: faker.image.urlPicsumPhotos(),
    lessons: [
      {
        type: LESSON_TYPE.multimedia.key,
        title: "Arithmetic Essentials: Numbers and Operations",
        description:
          "Explore the basics of arithmetic, including addition, subtraction, multiplication, and division. Learn how to perform these operations efficiently and understand their real-world applications.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Introduction to Arithmetic",
            body: "Arithmetic is the foundation of mathematics. In this lesson, you'll learn about numbers, basic operations, and their properties.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.open_answer.key,
            questionBody:
              "Why is arithmetic considered the foundation of mathematics? Provide an example of its application in everyday life.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            title: "Basic Arithmetic Video Tutorial",
            type: LESSON_FILE_TYPE.external_video.key,
            state: STATUS.published.key,
            body: "Learn the basics of arithmetic operations and how to use them in problem-solving scenarios.",
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody:
              "In arithmetic, [word] is the result of addition, while [word] is the result of subtraction.",
            state: STATUS.published.key,
            solutionExplanation:
              "<p>In arithmetic, <strong>sum</strong> is the result of addition, while <strong>difference</strong> is the result of subtraction.</p>",
            questionAnswers: [
              { optionText: "sum", isCorrect: true, position: 0 },
              { optionText: "difference", isCorrect: true, position: 1 },
            ],
          },
        ],
      },
      {
        type: LESSON_TYPE.multimedia.key,
        title: "Geometry Basics: Shapes and Measurements",
        description:
          "Discover the world of geometry by learning about shapes, angles, and measurements. Understand how geometry is used in design, architecture, and more.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Understanding Geometry",
            body: "Geometry involves the study of shapes, sizes, and the properties of space. In this lesson, you'll learn about basic geometric figures and their properties.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            title: "Geometric Shapes Presentation",
            type: LESSON_FILE_TYPE.external_presentation.key,
            state: STATUS.published.key,
            body: "Explore various geometric shapes, their formulas for area and perimeter, and their real-life applications.",
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "Which formula is used to calculate the area of a rectangle?",
            state: STATUS.published.key,
            questionAnswers: [
              { optionText: "length × width", isCorrect: true, position: 0 },
              { optionText: "length + width", isCorrect: false, position: 1 },
              { optionText: "length × height", isCorrect: false, position: 2 },
              { optionText: "2 × (length + width)", isCorrect: false, position: 3 },
            ],
          },
        ],
      },
      {
        type: LESSON_TYPE.multimedia.key,
        title: " Algebra Introduction: Solving for the Unknown",
        description:
          "Learn the basics of algebra, including variables, expressions, and equations. Master the skills needed to solve simple algebraic problems.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Getting Started with Algebra",
            body: "Algebra helps us solve problems by finding unknown values. In this lesson, you'll learn about variables, expressions, and simple equations.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody:
              "In algebra, [word] represent unknown values, while [word] are mathematical phrases that combine numbers and variables.",
            state: STATUS.published.key,
            solutionExplanation:
              "<p>In algebra, <strong>variables</strong> represent unknown values, while <strong>expressions</strong> are mathematical phrases that combine numbers and variables.</p>",
            questionAnswers: [
              { optionText: "variables", isCorrect: true, position: 0 },
              { optionText: "expressions", isCorrect: true, position: 1 },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            title: "Basic Algebra Video Guide",
            type: LESSON_FILE_TYPE.external_video.key,
            state: STATUS.published.key,
            body: "Learn to solve basic algebraic equations and understand how to work with variables.",
          },
        ],
      },
      {
        type: LESSON_TYPE.quiz.key,
        title: "Mathematics Basics Quiz: Test Your Knowledge",
        description:
          "Evaluate your understanding of arithmetic, geometry, and algebra with this comprehensive quiz.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "Which of the following is an example of a geometric shape?",
            state: STATUS.published.key,
            questionAnswers: [
              { optionText: "Triangle", isCorrect: true, position: 0 },
              { optionText: "Variable", isCorrect: false, position: 1 },
              { optionText: "Equation", isCorrect: false, position: 2 },
              { optionText: "Sum", isCorrect: false, position: 3 },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.multiple_choice.key,
            questionBody:
              "Which operations are included in basic arithmetic? (Select all that apply)",
            state: STATUS.published.key,
            questionAnswers: [
              { optionText: "Addition", isCorrect: true, position: 0 },
              { optionText: "Subtraction", isCorrect: true, position: 1 },
              { optionText: "Multiplication", isCorrect: true, position: 2 },
              { optionText: "Division", isCorrect: true, position: 3 },
              { optionText: "Integration", isCorrect: false, position: 4 },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody:
              "In algebra, [word] are used to represent unknowns, while [word] can be solved to find their values.",
            state: STATUS.published.key,
            solutionExplanation:
              "<p>In algebra, <strong>variables</strong> are used to represent unknowns, while <strong>equations</strong> can be solved to find their values.</p>",
            questionAnswers: [
              { optionText: "variables", isCorrect: true, position: 0 },
              { optionText: "equations", isCorrect: true, position: 1 },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "English Basics: Building a Strong Foundation",
    description:
      "Learn the fundamentals of English with this beginner-friendly course. From grammar to vocabulary, you'll gain the essential skills needed for effective communication in English. By the end of the course, you'll be equipped with the confidence to navigate everyday conversations and writing tasks with ease.",
    state: STATUS.published.key,
    priceInCents: 0,
    category: "Language Learning",
    imageUrl: faker.image.urlPicsumPhotos(),
    lessons: [
      {
        type: LESSON_TYPE.multimedia.key,
        title: "Mastering Basic Grammar Rules",
        description:
          "This lesson focuses on the foundational rules of English grammar, including sentence structure, parts of speech, and common mistakes to avoid.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Introduction to English Grammar",
            body: "Learn the essential grammar rules that form the backbone of English communication, covering nouns, verbs, adjectives, and more.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Sentence Structure Basics",
            body: "Explore how sentences are structured, including subject-verb agreement and word order in affirmative, negative, and question forms.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.open_answer.key,
            questionBody: "Explain the difference between a noun and a verb in a sentence.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            title: "Grammar Rules Video Tutorial",
            type: LESSON_FILE_TYPE.external_video.key,
            state: STATUS.published.key,
            body: "Watch this tutorial to get a comprehensive overview of essential English grammar rules.",
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_dnd.key,
            questionBody: "Fill in the blanks: 'She [word] to the store yesterday.",
            state: STATUS.published.key,
            solutionExplanation: "She <strong>went</strong> to the store yesterday.",
            questionAnswers: [
              {
                optionText: "went",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "go",
                isCorrect: false,
                position: 1,
              },
            ],
          },
        ],
      },
      {
        type: LESSON_TYPE.multimedia.key,
        title: "Building Vocabulary for Beginners",
        description:
          "Learn how to expand your vocabulary with everyday English words and phrases, essential for building conversations.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Common English Words and Phrases",
            body: "A beginner-friendly list of common English words and phrases you can use in daily conversations.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Synonyms and Antonyms",
            body: "Learn about the importance of synonyms and antonyms in expanding your vocabulary and making your speech more varied.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            title: "English Vocabulary Expansion Presentation",
            type: LESSON_FILE_TYPE.external_presentation.key,
            state: STATUS.published.key,
            body: "A comprehensive slide presentation on expanding your vocabulary.",
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "Which word is the synonym of 'happy'?",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "Joyful",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "Sad",
                isCorrect: false,
                position: 1,
              },
              {
                optionText: "Angry",
                isCorrect: false,
                position: 2,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_dnd.key,
            questionBody: "I [word] to the park every day.",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "go",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "went",
                isCorrect: false,
                position: 1,
              },
            ],
          },
        ],
      },
      {
        type: LESSON_TYPE.multimedia.key,
        title: "Mastering Pronunciation and Accent",
        description:
          "In this lesson, you’ll learn how to improve your English pronunciation and reduce common accent barriers.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Essential Pronunciation Tips",
            body: "Learn how to pronounce English words correctly and improve your accent with practical tips and exercises.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Common Pronunciation Mistakes",
            body: "Identify and work on common pronunciation challenges for non-native English speakers.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody:
              "Which of the following sounds is most commonly mispronounced by non-native English speakers?",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "Th",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "S",
                isCorrect: false,
                position: 1,
              },
              {
                optionText: "K",
                isCorrect: false,
                position: 2,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            title: "Pronunciation and Accent Video Tutorial",
            type: LESSON_FILE_TYPE.external_video.key,
            state: STATUS.published.key,
            body: "A step-by-step video guide on mastering English pronunciation.",
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody: "I love [word] (swimming/swim).",
            state: STATUS.published.key,
            solutionExplanation: "I love <strong>swimming</strong> (swimming/swim).",
            questionAnswers: [
              {
                optionText: "swimming",
                isCorrect: true,
                position: 0,
              },
            ],
          },
        ],
      },
      {
        type: LESSON_TYPE.quiz.key,
        title: "English Basics Quiz",
        description:
          "This quiz tests your knowledge of basic English grammar, vocabulary, and pronunciation.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody:
              "Which part of speech is the word 'quickly' in the sentence 'She ran quickly to the store'?",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "Adverb",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "Verb",
                isCorrect: false,
                position: 1,
              },
              {
                optionText: "Adjective",
                isCorrect: false,
                position: 2,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody: "She [word] to the park every day.",
            state: STATUS.published.key,
            solutionExplanation: "She <strong>went</strong> to the park every day.",
            questionAnswers: [
              {
                optionText: "goes",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "went",
                isCorrect: false,
                position: 1,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "What is the plural form of 'child'?",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "Children",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "Childs",
                isCorrect: false,
                position: 1,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "Which of these words is a conjunction?",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "And",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "Run",
                isCorrect: false,
                position: 1,
              },
              {
                optionText: "Quickly",
                isCorrect: false,
                position: 2,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Advanced English: Mastering Complex Language Skills",
    description:
      "Take your English proficiency to the next level with this advanced course. Dive deep into advanced grammar structures, vocabulary, idiomatic expressions, and perfect your writing and speaking skills. By the end of this course, you'll have the tools to express yourself with clarity, sophistication, and confidence.",
    state: STATUS.published.key,
    priceInCents: 0,
    category: "Language Learning",
    imageUrl: faker.image.urlPicsumPhotos(),
    lessons: [
      {
        type: LESSON_TYPE.multimedia.key,
        title: "Advanced Grammar: Perfecting Sentence Structures",
        description:
          "Explore advanced sentence structures, including complex and compound sentences, as well as the use of clauses and modifiers to improve writing and speaking.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Complex Sentences and Their Use",
            body: "Learn how to form and use complex sentences to convey more detailed thoughts and ideas effectively.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Relative Clauses and Modifiers",
            body: "A deep dive into relative clauses and modifiers, which help to add extra information to sentences.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.open_answer.key,
            questionBody: "What is the difference between a relative clause and a noun clause?",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            title: "Advanced Grammar Video Tutorial",
            type: LESSON_FILE_TYPE.external_video.key,
            state: STATUS.published.key,
            body: "Watch this in-depth video to understand complex sentence structures and advanced grammar.",
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody: "The book [word] I borrowed yesterday was fascinating.",
            state: STATUS.published.key,
            solutionExplanation:
              "The book <strong>that</strong> I borrowed yesterday was fascinating.",
            questionAnswers: [
              {
                optionText: "that",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "who",
                isCorrect: false,
                position: 1,
              },
            ],
          },
        ],
      },
      {
        type: LESSON_TYPE.multimedia.key,
        title: "Vocabulary Expansion: Academic and Formal English",
        description:
          "Learn high-level vocabulary to express complex ideas in academic, professional, and formal settings.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Academic Vocabulary and Its Application",
            body: "Master vocabulary words commonly used in academic papers, essays, and formal discussions.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Using Formal Language in Communication",
            body: "Learn how to adjust your language for formal situations, such as presentations or professional meetings.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            title: "Academic Vocabulary List",
            type: LESSON_FILE_TYPE.external_presentation.key,
            state: STATUS.published.key,
            body: "Download this list of academic vocabulary and explore their meanings and usage in context.",
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "Which word is an example of academic vocabulary?",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "Analyze",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "Run",
                isCorrect: false,
                position: 1,
              },
              {
                optionText: "Quick",
                isCorrect: false,
                position: 2,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody: "The results [word] the hypothesis.",
            state: STATUS.published.key,
            solutionExplanation: "The results <strong>support</strong> the hypothesis.",
            questionAnswers: [
              {
                optionText: "support",
                isCorrect: true,
                position: 0,
              },
            ],
          },
        ],
      },
      {
        type: LESSON_TYPE.multimedia.key,
        title: "Mastering Idiomatic Expressions",
        description:
          "Enhance your language fluency by mastering common idiomatic expressions used in advanced English conversations.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Understanding Idioms in Context",
            body: "Learn how idiomatic expressions are used in everyday conversations to sound more natural and fluent.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Common Idioms and Their Meanings",
            body: "A list of frequently used idioms, their meanings, and examples of how to use them.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.open_answer.key,
            questionBody: "What does the idiom 'break the ice' mean?",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            title: "Idiomatic Expressions Video Tutorial",
            type: LESSON_FILE_TYPE.external_video.key,
            state: STATUS.published.key,
            body: "Watch this video to learn how to use idiomatic expressions in real conversations.",
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody: "She was [word] when she heard the good news.",
            state: STATUS.published.key,
            solutionExplanation:
              "She was <strong>over the moon</strong> when she heard the good news.",
            questionAnswers: [
              {
                optionText: "over the moon",
                isCorrect: true,
                position: 0,
              },
            ],
          },
        ],
      },
      {
        type: LESSON_TYPE.multimedia.key,
        title: "Advanced Writing Skills: Crafting Cohesive Paragraphs",
        description:
          "Learn how to write complex, well-structured paragraphs that convey your ideas clearly and persuasively in advanced writing contexts.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Topic Sentences and Supporting Details",
            body: "Learn how to craft a clear topic sentence and use supporting details effectively in your writing.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Transitions and Coherence in Writing",
            body: "Understand the importance of transitions and coherence to make your paragraphs flow logically.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            title: "Paragraph Writing Practice",
            type: LESSON_FILE_TYPE.external_presentation.key,
            state: STATUS.published.key,
            body: "Download this practice worksheet to improve your paragraph writing skills.",
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody:
              "The introduction [word] should [word] the main points [word] in the essay.",
            state: STATUS.published.key,
            solutionExplanation:
              "The introduction <strong>paragraph</strong> should <strong>outline</strong> the main points <strong>discussed</strong> in the essay.",
            questionAnswers: [
              {
                optionText: "paragraph",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "outline",
                isCorrect: true,
                position: 1,
              },
              {
                optionText: "discussed",
                isCorrect: true,
                position: 2,
              },
            ],
          },
        ],
      },
      {
        type: LESSON_TYPE.multimedia.key,
        title: "Public Speaking: Delivering a Persuasive Speech",
        description:
          "Develop your public speaking skills by learning how to structure and deliver a persuasive speech that captivates your audience.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Structuring a Persuasive Speech",
            body: "Learn the key components of a persuasive speech, including introduction, body, and conclusion.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.text_block.key,
            title: "Techniques for Engaging Your Audience",
            body: "Discover techniques such as storytelling, rhetorical questions, and powerful language to keep your audience engaged.",
            state: STATUS.published.key,
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "What is the purpose of the conclusion in a persuasive speech?",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "Summarize the main points",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "Introduce new information",
                isCorrect: false,
                position: 1,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.file.key,
            title: "Persuasive Speech Example",
            type: LESSON_FILE_TYPE.external_video.key,
            state: STATUS.published.key,
            body: "Listen to this persuasive speech example to see effective techniques in action.",
          },
        ],
      },
      {
        type: LESSON_TYPE.quiz.key,
        title: "Advanced English Quiz: Test Your Knowledge",
        description:
          "Test your mastery of advanced English skills, including grammar, vocabulary, idioms, writing, and public speaking.",
        state: STATUS.published.key,
        imageUrl: faker.image.urlPicsumPhotos(),
        isFree: false,
        items: [
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "Which sentence is an example of a complex sentence?",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "She went to the store, and he stayed home.",
                isCorrect: false,
                position: 0,
              },
              {
                optionText: "Although it was raining, she went for a walk.",
                isCorrect: true,
                position: 1,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.single_choice.key,
            questionBody: "Which idiom means 'to be very happy'?",
            state: STATUS.published.key,
            questionAnswers: [
              {
                optionText: "On cloud nine",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "Hit the nail on the head",
                isCorrect: false,
                position: 1,
              },
            ],
          },
          {
            itemType: LESSON_ITEM_TYPE.question.key,
            questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
            questionBody: "The manager will [word] the team meeting [word].",
            state: STATUS.published.key,
            solutionExplanation:
              "The manager will <strong>lead</strong> the team meeting <strong>tomorrow</strong>.",
            questionAnswers: [
              {
                optionText: "lead",
                isCorrect: true,
                position: 0,
              },
              {
                optionText: "tomorrow",
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
