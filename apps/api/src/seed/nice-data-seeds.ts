import { faker } from "@faker-js/faker";

import { LESSON_TYPES, QuestionType } from "src/lesson/lesson.type";

import type { NiceCourseData } from "src/utils/types/test-types";

export const niceCourses: NiceCourseData[] = [
  {
    title: "Introduction to Web Development: Building Your First Website",
    description:
      "In this beginner-friendly course, you will learn the basics of web development. We will guide you through creating a simple website from scratch using HTML, CSS, and a bit of JavaScript. No prior experience is needed—just a willingness to learn! By the end of the course, you’ll have built your own website and gained essential skills for further web development projects.",
    isPublished: true,
    priceInCents: 9900,
    category: "Web Development",
    thumbnailS3Key: faker.image.urlPicsumPhotos(),
    chapters: [
      {
        title: "HTML Basics: Building the Structure of Your Website",
        isPublished: true,
        isFreemium: false,
        displayOrder: 1,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Introduction to HTML",
            description:
              "HTML (HyperText Markup Language) is the standard language used to create the structure of web pages. In this lesson, you'll explore basic HTML elements and how they are used to build the framework of a website.",
            displayOrder: 1,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "HTML Quiz: Importance of HTML",
            description: "Why is HTML considered the backbone of any website?",
            displayOrder: 2,
            questions: [
              {
                id: crypto.randomUUID(),
                displayOrder: 1,
                type: QuestionType.BriefResponse,
                title: "Why is HTML considered the backbone of any website?",
                description: "Explain its role in web development.",
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.VIDEO,
            title: "HTML Elements Video",
            description:
              "Learn the basics of web development with HTML! Master the structure and tags needed to build professional websites from scratch.",
            displayOrder: 3,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "CSS and Layout Quiz",
            description:
              "In CSS, [word] is used to style the layout, while [word] is used to change colors.",
            displayOrder: 4,
            questions: [
              {
                id: crypto.randomUUID(),
                displayOrder: 1,
                type: QuestionType.FillInTheBlanksText,
                title:
                  "In CSS, [word] is used to style the layout, while [word] is used to change colors.",
                description:
                  "<p>In CSS, <strong>flexbox</strong> is used to style the layout, while <strong>color properties</strong> are used to change colors.</p>",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "flexbox",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "color properties",
                    isCorrect: true,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "grid",
                    isCorrect: false,
                    displayOrder: 3,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "flex",
                    isCorrect: false,
                    displayOrder: 4,
                  },
                ],
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.PRESENTATION,
            title: "HTML Hyperlinks Presentation",
            description:
              "Learn the basics of web development with HTML! Master the structure and tags needed to build professional websites from scratch.",
            displayOrder: 5,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "HTML Tag Quiz",
            description: "Which HTML tag is used to create a hyperlink?",
            displayOrder: 6,
            questions: [
              {
                id: crypto.randomUUID(),
                type: QuestionType.SingleChoice,
                title: "Which HTML tag is used to create a hyperlink?",
                displayOrder: 1,
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "<a>",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "<link>",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "<button>",
                    isCorrect: false,
                    displayOrder: 3,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "<input>",
                    isCorrect: false,
                    displayOrder: 4,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "HTML Basics: Test Your Knowledge",
        isPublished: true,
        isFreemium: false,
        displayOrder: 2,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "HTML Basics: Test Your Knowledge",
            description:
              "This lesson is designed to test your understanding of basic HTML concepts. You'll encounter a mix of multiple-choice and single-answer questions to evaluate your knowledge of HTML structure and common elements.",
            displayOrder: 1,
            questions: [
              {
                id: crypto.randomUUID(),
                type: QuestionType.SingleChoice,
                title: "Which of the following HTML tags is used to create an image?",
                displayOrder: 1,
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "<img>",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "<picture>",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "<video>",
                    isCorrect: false,
                    displayOrder: 3,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "<audio>",
                    isCorrect: false,
                    displayOrder: 4,
                  },
                ],
              },
              {
                id: crypto.randomUUID(),
                type: QuestionType.MultipleChoice,
                title:
                  "Which of the following are valid HTML elements for structuring content? (Select all that apply)",
                displayOrder: 2,
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "<html>",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "<head>",
                    isCorrect: true,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "<body>",
                    isCorrect: true,
                    displayOrder: 3,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "<title>",
                    isCorrect: true,
                    displayOrder: 4,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "<h1>",
                    isCorrect: false,
                    displayOrder: 5,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "<p>",
                    isCorrect: false,
                    displayOrder: 6,
                  },
                ],
              },
              {
                id: crypto.randomUUID(),
                type: QuestionType.SingleChoice,
                title: "Which HTML tag is used to create a hyperlink?",
                displayOrder: 3,
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "<a>",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "<link>",
                    isCorrect: false,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "<button>",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "<input>",
                    isCorrect: false,
                    displayOrder: 3,
                  },
                ],
              },
              {
                id: crypto.randomUUID(),
                type: QuestionType.MultipleChoice,
                title:
                  "Which of the following attributes are commonly used with the <img> tag? (Select all that apply)",
                displayOrder: 4,
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "alt",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "src",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "width",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "height",
                    isCorrect: false,
                    displayOrder: 3,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "srcset",
                    isCorrect: false,
                    displayOrder: 4,
                  },
                ],
              },
              {
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                title:
                  "CSS is used to style [word], while JavaScript is used to add [word] to web pages.",
                displayOrder: 5,
                description:
                  "<p>CSS is used to style <strong>HTML</strong>, while JavaScript is used to add <strong>interactivity</strong> to web pages.</p>",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "HTML",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "interactivity",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "styles",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "functions",
                    isCorrect: false,
                    displayOrder: 3,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "content",
                    isCorrect: false,
                    displayOrder: 4,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "elements",
                    isCorrect: false,
                    displayOrder: 5,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "animations",
                    isCorrect: false,
                    displayOrder: 6,
                  },
                ],
              },
              {
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksText,
                displayOrder: 6,
                title:
                  "In CSS, [word] is used to style the layout, while [word] is used to change colors.",
                description:
                  "<p>In CSS, <strong>flexbox</strong> is used to style the layout, while <strong>color properties</strong> are used to change colors.</p>",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "flexbox",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "color properties",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                ],
              },
              {
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                displayOrder: 7,
                title:
                  "In JavaScript, [word] are used to store data, while [word] are used to perform actions.",
                description:
                  "<p>In JavaScript, <strong>variables</strong> are used to store data, while <strong>functions</strong> are used to perform actions.</p>",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "variables",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "functions",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "CSS Fundamentals: Put Your Skills to the Test",
        isPublished: true,
        isFreemium: true,
        displayOrder: 3,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "CSS Fundamentals: Put Your Skills to the Test",
            description:
              "This lesson is a comprehensive quiz to evaluate your understanding of CSS fundamentals. You'll face a variety of question types covering selectors, properties, and layout techniques.",
            displayOrder: 1,
            questions: [
              {
                id: crypto.randomUUID(),
                displayOrder: 1,
                type: QuestionType.SingleChoice,
                title: "Which CSS property is used to change the text color of an element?",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "color",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "text-color",
                    isCorrect: false,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "font-color",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "text-style",
                    isCorrect: false,
                    displayOrder: 3,
                  },
                ],
              },
              {
                id: crypto.randomUUID(),
                type: QuestionType.MultipleChoice,
                title: "Which of the following are valid CSS selectors? (Select all that apply)",
                displayOrder: 2,
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: ".class-name",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "#id-name",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "element",
                    isCorrect: true,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "[attribute]",
                    isCorrect: true,
                    displayOrder: 3,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "$variable",
                    isCorrect: false,
                    displayOrder: 4,
                  },
                ],
              },
              {
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                title:
                  "The CSS [word] property is used for creating flexible box layouts, while [word] is used for creating grid layouts.",
                description:
                  "<p>The CSS <strong>flexbox</strong> property is used for creating flexible box layouts, while <strong>color properties</strong> are used for creating grid layouts.</p>",
                displayOrder: 3,
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "flexbox",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "color properties",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "grid",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "flex",
                    isCorrect: false,
                    displayOrder: 3,
                  },
                ],
              },
              {
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                displayOrder: 4,
                title: "To center an element horizontally, you can use 'margin: [word] [word];'.",
                description:
                  "<p>To center an element horizontally, you can use 'margin: <strong>0 auto</strong>;'.</p>",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "0",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "auto",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "HTML Basics: Building the Structure of Your Website",
        isPublished: true,
        isFreemium: false,
        displayOrder: 4,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Introduction to HTML",
            description:
              "HTML (HyperText Markup Language) is the standard language used to create the structure of web pages. In this lesson, you'll explore basic HTML elements and how they are used to build the framework of a website.",
            displayOrder: 1,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "HTML Quiz: Importance of HTML",
            description: "Why is HTML considered the backbone of any website?",
            displayOrder: 2,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.BriefResponse,
                title:
                  "Why is HTML considered the backbone of any website? Explain its role in web development.",
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.VIDEO,
            title: "HTML Elements Video",
            description:
              "Learn the basics of web development with HTML! Master the structure and tags needed to build professional websites from scratch.",
            displayOrder: 3,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "CSS and Layout Quiz",
            description:
              "In CSS, [word] is used to style the layout, while [word] is used to change colors.",
            displayOrder: 4,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                title:
                  "In CSS, [word] is used to style the layout, while [word] is used to change colors.",
                description:
                  "<p>In CSS, <strong>flexbox</strong> is used to style the layout, while <strong>color properties</strong> are used to change colors.</p>",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "flexbox",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "color properties",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "grid",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "flex",
                    isCorrect: false,
                    displayOrder: 3,
                  },
                ],
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
    isPublished: true,
    priceInCents: 0,
    category: "Mobile Development",
    thumbnailS3Key: faker.image.urlPicsumPhotos(),
    chapters: [
      {
        title: "Java Basics: Building Blocks of Android Development",
        isPublished: true,
        isFreemium: false,
        displayOrder: 1,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Introduction to Java for Android",
            description:
              "Java is the primary language used for Android app development. In this lesson, you'll learn about Java syntax, data types, and object-oriented programming principles that form the foundation of Android development.",
            displayOrder: 1,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "Explain why Java is the preferred language for Android development",
            description: "",
            displayOrder: 2,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.BriefResponse,
                title: "Explain why Java is the preferred language for Android development.",
                description: "",
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.VIDEO,
            title: "Java Basics Video Tutorial",
            description: "Learn Java basics for Android development.",
            displayOrder: 3,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title:
              "In Java, [word] are used to define the blueprint of objects, while [word] are instances.",
            description: "",
            displayOrder: 4,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                title:
                  "In Java, [word] are used to define the blueprint of objects, while [word] are instances.",
                description:
                  "<p>In Java, <strong>classes</strong> are used to define the blueprint of objects, while <strong>objects</strong> are instances of these blueprints.</p>",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "classes",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "objects",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                ],
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title:
              "In Android dev, [word] are used to define the user interface, while [word] handle user interactions",
            description: "",
            displayOrder: 5,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                title:
                  "In Android dev, [word] are used to define the user interface, while [word] handle user interactions.",
                description:
                  "<p>In Android development, <strong>layouts</strong> are used to define the user interface, while <strong>activities</strong> handle user interactions and app logic.</p>",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "layouts",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "activities",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                ],
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.PRESENTATION,
            title: "Java OOP Concepts Presentation",
            description: "Explore Object-Oriented Programming principles in Java.",
            displayOrder: 6,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "Which keyword is used to create a new instance of a class in Java?",
            description: "",
            displayOrder: 7,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.SingleChoice,
                title: "Which keyword is used to create a new instance of a class in Java?",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "new",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "create",
                    isCorrect: false,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "instance",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "object",
                    isCorrect: false,
                    displayOrder: 3,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Android Development Basics: Test Your Knowledge",
        isPublished: true,
        isFreemium: false,
        displayOrder: 2,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "Which of the following is the entry point of an Android application?",
            description: "",
            displayOrder: 1,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.SingleChoice,
                title: "Which of the following is the entry point of an Android application?",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "Activity",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Service",
                    isCorrect: false,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "BroadcastReceiver",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "ContentProvider",
                    isCorrect: false,
                    displayOrder: 3,
                  },
                ],
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
    isPublished: true,
    priceInCents: 0,
    category: "Mobile Development",
    thumbnailS3Key: faker.image.urlPicsumPhotos(),
    chapters: [
      {
        title: "Getting Started with Kotlin Programming",
        isPublished: true,
        isFreemium: false,
        displayOrder: 1,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Introduction to Kotlin for Android",
            description:
              "Kotlin is a modern, concise language used for Android development. In this lesson, you'll learn about Kotlin syntax and basic concepts for creating Android apps.",
            displayOrder: 1,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.VIDEO,
            title: "Kotlin Basics Video Tutorial",
            description:
              "A video tutorial to help you learn Kotlin syntax, object-oriented principles, and how to apply them to Android development.",
            displayOrder: 2,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "Which keyword is used to declare a variable in Kotlin?",
            description: "",
            displayOrder: 3,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.SingleChoice,
                title: "Which keyword is used to declare a variable in Kotlin?",
                options: [
                  { id: crypto.randomUUID(), optionText: "var", isCorrect: true, displayOrder: 0 },
                  { id: crypto.randomUUID(), optionText: "val", isCorrect: false, displayOrder: 1 },
                  { id: crypto.randomUUID(), optionText: "let", isCorrect: false, displayOrder: 2 },
                  {
                    id: crypto.randomUUID(),
                    optionText: "data",
                    isCorrect: false,
                    displayOrder: 3,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Building Your First App with Kotlin",
        isPublished: true,
        isFreemium: false,
        displayOrder: 2,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Setting Up Your Android Studio Environment",
            description:
              "Learn how to configure Android Studio for Kotlin development and create your first Android project.",
            displayOrder: 1,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.PRESENTATION,
            title: "Creating a Simple Kotlin App",
            description: "A step-by-step guide to building your first Android app using Kotlin.",
            displayOrder: 2,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "In Kotlin, [word] are immutable variables, while [word] are mutable variables.",
            description: "",
            displayOrder: 3,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                title:
                  "In Kotlin, [word] are immutable variables, while [word] are mutable variables.",
                description:
                  "<p>In Kotlin, <strong>val</strong> are immutable variables, while <strong>var</strong> are mutable variables.</p>",
                options: [
                  { id: crypto.randomUUID(), optionText: "val", isCorrect: true, displayOrder: 0 },
                  { id: crypto.randomUUID(), optionText: "var", isCorrect: true, displayOrder: 1 },
                ],
              },
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
    isPublished: true,
    priceInCents: 0,
    category: "Mathematics",
    thumbnailS3Key: faker.image.urlPicsumPhotos(),
    chapters: [
      {
        title: "Arithmetic Essentials: Numbers and Operations",
        isPublished: true,
        isFreemium: false,
        displayOrder: 1,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Introduction to Arithmetic",
            description:
              "Arithmetic is the foundation of mathematics. In this lesson, you'll learn about numbers, basic operations, and their properties.",
            displayOrder: 1,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "Why is arithmetic considered the foundation of mathematics? ",
            description: "",
            displayOrder: 2,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.BriefResponse,
                title:
                  "Why is arithmetic fundamental in math? Give a real-life example of its use.",
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.VIDEO,
            title: "Basic Arithmetic Video Tutorial",
            description:
              "Learn the basics of arithmetic operations and how to use them in problem-solving scenarios.",
            displayOrder: 3,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title:
              "In arithmetic, [word] is the result of addition, while [word] is the result of subtraction.",
            description: "",
            displayOrder: 4,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                title:
                  "In arithmetic, [word] is the result of addition, while [word] is the result of subtraction.",
                description:
                  "<p>In arithmetic, <strong>sum</strong> is the result of addition, while <strong>difference</strong> is the result of subtraction.</p>",
                options: [
                  { id: crypto.randomUUID(), optionText: "sum", isCorrect: true, displayOrder: 0 },
                  {
                    id: crypto.randomUUID(),
                    optionText: "difference",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Geometry Basics: Shapes and Measurements",
        isPublished: true,
        isFreemium: false,
        displayOrder: 2,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Understanding Geometry",
            description:
              "Geometry involves the study of shapes, sizes, and the properties of space. In this lesson, you'll learn about basic geometric figures and their properties.",
            displayOrder: 1,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.PRESENTATION,
            title: "Geometric Shapes Presentation",
            description:
              "Explore various geometric shapes, their formulas for area and perimeter, and their real-life applications.",
            displayOrder: 2,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "Which formula is used to calculate the area of a rectangle?",
            description: "",
            displayOrder: 3,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.SingleChoice,
                title: "Which formula is used to calculate the area of a rectangle?",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "length × width",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "length + width",
                    isCorrect: false,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "length × height",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "2 × (length + width)",
                    isCorrect: false,
                    displayOrder: 3,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Algebra Introduction: Solving for the Unknown",
        isPublished: true,
        isFreemium: false,
        displayOrder: 3,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Getting Started with Algebra",
            description:
              "Algebra helps us solve problems by finding unknown values. In this lesson, you'll learn about variables, expressions, and simple equations.",
            displayOrder: 1,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title:
              "In algebra, [word] represent unknown values, while [word] are mathematical phrases",
            description: "",
            displayOrder: 2,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                title:
                  "In algebra, [word] represent unknown values, while [word] are mathematical phrases",
                description:
                  "<p>In algebra, <strong>variables</strong> represent unknown values, while <strong>expressions</strong> are mathematical phrases that combine numbers and variables.</p>",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "variables",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "expressions",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                ],
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.VIDEO,
            title: "Basic Algebra Video Guide",
            description:
              "Learn to solve basic algebraic equations and understand how to work with variables.",
            displayOrder: 3,
          },
        ],
      },
      {
        title: "Mathematics Basics Quiz: Test Your Knowledge",
        isPublished: true,
        isFreemium: false,
        displayOrder: 4,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "Mathematics Basics Quiz: Test Your Knowledge",
            description:
              "Evaluate your understanding of arithmetic, geometry, and algebra with this comprehensive quiz.",
            displayOrder: 1,
            questions: [
              {
                id: crypto.randomUUID(),
                type: QuestionType.SingleChoice,
                title: "Which of the following is an example of a geometric shape?",
                displayOrder: 1,
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "Triangle",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Variable",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Equation",
                    isCorrect: false,
                    displayOrder: 3,
                  },
                  { id: crypto.randomUUID(), optionText: "Sum", isCorrect: false, displayOrder: 4 },
                ],
              },
              {
                id: crypto.randomUUID(),
                type: QuestionType.MultipleChoice,
                title: "Which operations are included in basic arithmetic? (Select all that apply)",
                displayOrder: 2,
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "Addition",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Subtraction",
                    isCorrect: true,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Multiplication",
                    isCorrect: true,
                    displayOrder: 3,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Division",
                    isCorrect: true,
                    displayOrder: 4,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Integration",
                    isCorrect: false,
                    displayOrder: 5,
                  },
                ],
              },
              {
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                title:
                  "In algebra, [word] are used to represent unknowns, while [word] can be solved to find their values.",
                description:
                  "<p>In algebra, <strong>variables</strong> are used to represent unknowns, while <strong>equations</strong> can be solved to find their values.</p>",
                displayOrder: 3,
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "variables",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "equations",
                    isCorrect: true,
                    displayOrder: 2,
                  },
                ],
              },
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
    isPublished: true,
    priceInCents: 0,
    category: "Language Learning",
    thumbnailS3Key: faker.image.urlPicsumPhotos(),
    chapters: [
      {
        title: "Mastering Basic Grammar Rules",
        isPublished: true,
        isFreemium: false,
        displayOrder: 1,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Introduction to English Grammar",
            description:
              "Learn the essential grammar rules that form the backbone of English communication, covering nouns, verbs, adjectives, and more.",
            displayOrder: 1,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Sentence Structure Basics",
            description:
              "Explore how sentences are structured, including subject-verb agreement and word order in affirmative, negative, and question forms.",
            displayOrder: 2,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "Explain the difference between a noun and a verb in a sentence.",
            description: "Explain the difference between a noun and a verb in a sentence.",
            displayOrder: 3,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.BriefResponse,
                title: "Explain the difference between a noun and a verb in a sentence.",
                description: "Explain its role in sentence construction.",
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.VIDEO,
            title: "Grammar Rules Video Tutorial",
            description:
              "Watch this tutorial to get a comprehensive overview of essential English grammar rules.",
            displayOrder: 4,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "Fill in the blanks: 'She [word] to the store yesterday.'",
            description: "Fill in the blanks with the correct verb.",
            displayOrder: 5,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                title: "Fill in the blanks: 'She [word] to the store yesterday.'",
                description: "<p>She <strong>went</strong> to the store yesterday.</p>",
                options: [
                  { id: crypto.randomUUID(), optionText: "went", isCorrect: true, displayOrder: 0 },
                  { id: crypto.randomUUID(), optionText: "go", isCorrect: false, displayOrder: 1 },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Building Vocabulary for Beginners",
        isPublished: true,
        isFreemium: false,
        displayOrder: 2,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Common English Words and Phrases",
            description:
              "A beginner-friendly list of common English words and phrases you can use in daily conversations.",
            displayOrder: 1,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Synonyms and Antonyms",
            description:
              "Learn about the importance of synonyms and antonyms in expanding your vocabulary and making your speech more varied.",
            displayOrder: 2,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.PRESENTATION,
            title: "English Vocabulary Expansion Presentation",
            description: "A comprehensive slide presentation on expanding your vocabulary.",
            displayOrder: 3,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "Which word is the synonym of 'happy'?",
            description: "Choose the correct synonym for 'happy'.",
            displayOrder: 4,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.SingleChoice,
                title: "Which word is the synonym of 'happy'?",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "Joyful",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  { id: crypto.randomUUID(), optionText: "Sad", isCorrect: false, displayOrder: 1 },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Angry",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                ],
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "I [word] to the park every day.",
            description: "Fill in the blank with the correct verb.",
            displayOrder: 5,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                title: "I [word] to the park every day.",
                options: [
                  { id: crypto.randomUUID(), optionText: "go", isCorrect: true, displayOrder: 0 },
                  {
                    id: crypto.randomUUID(),
                    optionText: "went",
                    isCorrect: false,
                    displayOrder: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Mastering Pronunciation and Accent",
        isPublished: true,
        isFreemium: false,
        displayOrder: 3,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Essential Pronunciation Tips",
            description:
              "Learn how to pronounce English words correctly and improve your accent with practical tips and exercises.",
            displayOrder: 1,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Common Pronunciation Mistakes",
            description:
              "Identify and work on common pronunciation challenges for non-native English speakers.",
            displayOrder: 2,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title:
              "Which of the following sounds is most commonly mispronounced by non-native English speakers?",
            description: "Choose the sound that is most commonly mispronounced.",
            displayOrder: 3,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.SingleChoice,
                title:
                  "Which of the following sounds is most commonly mispronounced by non-native English speakers?",
                options: [
                  { id: crypto.randomUUID(), optionText: "Th", isCorrect: true, displayOrder: 0 },
                  { id: crypto.randomUUID(), optionText: "S", isCorrect: false, displayOrder: 1 },
                  { id: crypto.randomUUID(), optionText: "K", isCorrect: false, displayOrder: 2 },
                ],
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.VIDEO,
            title: "Pronunciation and Accent Video Tutorial",
            description: "A step-by-step video guide on mastering English pronunciation.",
            displayOrder: 4,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "I love [word] (swimming/swim).",
            description: "Choose the correct verb form.",
            displayOrder: 5,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                title: "I love [word] (swimming/swim).",
                description: "I love <strong>swimming</strong> (swimming/swim).",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "swimming",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "English Basics Quiz",
        isPublished: true,
        isFreemium: false,
        displayOrder: 4,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title:
              "Which part of speech is the word 'quickly' in the sentence 'She ran quickly to the store'?",
            description: "Choose the correct part of speech.",
            displayOrder: 1,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.SingleChoice,
                title:
                  "Which part of speech is the word 'quickly' in the sentence 'She ran quickly to the store'?",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "Adverb",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Verb",
                    isCorrect: false,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Adjective",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                ],
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "She [word] to the park every day.",
            description: "Fill in the blank with the correct verb.",
            displayOrder: 2,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                title: "She [word] to the park every day.",
                description: "She <strong>went</strong> to the park every day.",
                options: [
                  { id: crypto.randomUUID(), optionText: "goes", isCorrect: true, displayOrder: 0 },
                  {
                    id: crypto.randomUUID(),
                    optionText: "went",
                    isCorrect: false,
                    displayOrder: 1,
                  },
                ],
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "What is the plural form of 'child'?",
            description: "Choose the correct plural form of 'child'.",
            displayOrder: 3,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.SingleChoice,
                title: "What is the plural form of 'child'?",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "Children",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Childs",
                    isCorrect: false,
                    displayOrder: 1,
                  },
                ],
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "Which of these words is a conjunction?",
            description: "Choose the correct conjunction.",
            displayOrder: 4,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.SingleChoice,
                title: "Which of these words is a conjunction?",
                options: [
                  { id: crypto.randomUUID(), optionText: "And", isCorrect: true, displayOrder: 0 },
                  { id: crypto.randomUUID(), optionText: "Run", isCorrect: false, displayOrder: 1 },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Quickly",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                ],
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
    isPublished: true,
    priceInCents: 0,
    category: "Language Learning",
    thumbnailS3Key: faker.image.urlPicsumPhotos(),
    chapters: [
      {
        title: "Advanced Grammar: Perfecting Sentence Structures",
        isPublished: true,
        displayOrder: 1,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Complex Sentences and Their Use",
            description:
              "Learn how to form and use complex sentences to convey more detailed thoughts and ideas effectively.",
            displayOrder: 1,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Relative Clauses and Modifiers",
            description:
              "A deep dive into relative clauses and modifiers, which help to add extra information to sentences.",
            displayOrder: 2,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "Difference between a relative clause and a noun clause",
            description: "Explain the difference between relative and noun clauses.",
            displayOrder: 3,
            questions: [
              {
                id: crypto.randomUUID(),
                type: QuestionType.SingleChoice,
                title: "What is the difference between a relative clause and a noun clause?",
                displayOrder: 1,
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "Relative clauses are used to modify nouns",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Relative clauses are used to introduce new information",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Noun clauses are used to modify nouns",
                    isCorrect: false,
                    displayOrder: 3,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Noun clauses are used to introduce new information",
                    isCorrect: false,
                    displayOrder: 4,
                  },
                ],
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.VIDEO,
            title: "Advanced Grammar Video Tutorial",
            description:
              "Watch this in-depth video to understand complex sentence structures and advanced grammar.",
            displayOrder: 4,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "Fill in the blanks: The book [word] I borrowed yesterday was fascinating.",
            description: "Fill in the blank with the correct word.",
            displayOrder: 5,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                title: "The book [word] I borrowed yesterday was fascinating.",
                description: "The book <strong>that</strong> I borrowed yesterday was fascinating.",
                options: [
                  { id: crypto.randomUUID(), optionText: "that", isCorrect: true, displayOrder: 0 },
                  { id: crypto.randomUUID(), optionText: "who", isCorrect: false, displayOrder: 1 },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Vocabulary Expansion: Academic and Formal English",
        isPublished: true,
        displayOrder: 2,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Academic Vocabulary and Its Application",
            description:
              "Master vocabulary words commonly used in academic papers, essays, and formal discussions.",
            displayOrder: 1,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Using Formal Language in Communication",
            description:
              "Learn how to adjust your language for formal situations, such as presentations or professional meetings.",
            displayOrder: 2,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.PRESENTATION,
            title: "Academic Vocabulary List",
            description:
              "Download this list of academic vocabulary and explore their meanings and usage in context.",
            displayOrder: 3,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "Which word is an example of academic vocabulary?",
            description: "Select the correct academic word.",
            displayOrder: 4,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.SingleChoice,
                title: "Which word is an example of academic vocabulary?",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "Analyze",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  { id: crypto.randomUUID(), optionText: "Run", isCorrect: false, displayOrder: 1 },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Quick",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                ],
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "The results [word] the hypothesis.",
            description: "Fill in the blank with the correct word.",
            displayOrder: 5,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                title: "The results [word] the hypothesis.",
                description: "The results <strong>support</strong> the hypothesis.",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "support",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Mastering Idiomatic Expressions",
        isPublished: true,
        displayOrder: 3,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Understanding Idioms in Context",
            description:
              "Learn how idiomatic expressions are used in everyday conversations to sound more natural and fluent.",
            displayOrder: 1,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Common Idioms and Their Meanings",
            description:
              "A list of frequently used idioms, their meanings, and examples of how to use them.",
            displayOrder: 2,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "What does the idiom 'break the ice' mean?",
            description: "Explain the meaning of the idiom 'break the ice'.",
            displayOrder: 3,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.VIDEO,
            title: "Idiomatic Expressions Video Tutorial",
            description:
              "Watch this video to learn how to use idiomatic expressions in real conversations.",
            displayOrder: 4,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "She was [word] when she heard the good news.",
            description: "Fill in the blank with the correct idiom.",
            displayOrder: 5,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                title: "She was [word] when she heard the good news.",
                description: "She was <strong>over the moon</strong> when she heard the good news.",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "over the moon",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Artificial Intelligence in Business: Fundamentals",
    description:
      "This beginner-friendly course introduces the basics of AI in business. Learn about key concepts, terminologies, and how AI is applied to improve efficiency, automate processes, and enhance decision-making in various industries. By the end, you'll understand AI's potential to transform your business.",
    isPublished: true,
    priceInCents: 12900,
    category: "Artificial Intelligence",
    thumbnailS3Key: faker.image.urlPicsumPhotos(),
    chapters: [
      {
        title: "Understanding AI Basics",
        isPublished: true,
        isFreemium: false,
        displayOrder: 1,
        lessons: [
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.VIDEO,
            title: "What is Artificial Intelligence? An Introductory Overview",
            description:
              "A comprehensive video introduction to the concept of Artificial Intelligence, its history, and its significance in business.",
            displayOrder: 1,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.TEXT,
            title: "Key Concepts and Terminologies in AI",
            description:
              '<p>Artificial Intelligence (AI) refers to the simulation of human intelligence in machines programmed to think, learn, and make decisions. Below are some key concepts and terminologies essential to understanding AI:</p><ul><li><strong>Machine Learning (ML):</strong> A subset of AI focused on creating algorithms that allow computers to learn from and make predictions based on data. Example: A recommendation system suggesting movies based on your viewing history.</li><li><strong>Neural Networks:</strong> Inspired by the human brain, these are algorithms designed to recognize patterns and process data in layers, enabling tasks like image and speech recognition.</li><li><strong>Natural Language Processing (NLP):</strong> This involves teaching machines to understand, interpret, and generate human language. Example: Virtual assistants like Alexa or Siri.</li><li><strong>Computer Vision:</strong> A field of AI that enables computers to interpret and process visual data, such as images and videos. Example: Facial recognition technology.</li><li><strong>Deep Learning:</strong> A more complex subset of ML that uses large neural networks to analyze massive amounts of data and solve intricate problems, such as self-driving cars.</li><li><strong>Supervised vs. Unsupervised Learning:</strong><br>- <strong>Supervised Learning:</strong> The AI is trained on labeled data (e.g., images labeled as "cat" or "dog").<br>- <strong>Unsupervised Learning:</strong> The AI identifies patterns in unlabeled data without explicit instructions.</li><li><strong>Big Data:</strong> The large volume of structured and unstructured data generated by businesses and devices, which is essential for training AI models.</li><li><strong>Automation:</strong> AI is often used to automate repetitive tasks, freeing up human resources for more complex activities.</li><li><strong>Ethics in AI:</strong> As AI becomes more powerful, ensuring its ethical use (e.g., avoiding bias in decision-making) is critical for building trust.</li></ul><h3>Why These Concepts Matter</h3><p>Understanding these basic AI terms is the first step toward recognizing how AI can be applied in business. Each concept represents a building block of AI\'s potential to transform industries by increasing efficiency, improving decision-making, and creating innovative solutions.</p>',
            displayOrder: 2,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.PRESENTATION,
            title: "AI Applications Across Industries",
            description:
              "A presentation exploring real-world AI applications in sectors like healthcare, finance, and retail.",
            displayOrder: 3,
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "AI Quiz: Primary Goal of AI in Business",
            description:
              "Test your understanding of the fundamental goal of AI in business applications.",
            displayOrder: 4,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.SingleChoice,
                title: "What is the primary goal of AI in business?",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "Replace human workers",
                    isCorrect: false,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Automate repetitive tasks",
                    isCorrect: false,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Improve decision-making",
                    isCorrect: true,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Eliminate operational costs",
                    isCorrect: false,
                    displayOrder: 3,
                  },
                ],
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "AI Quiz: Applications of AI",
            description: "Identify common AI applications in various business domains.",
            displayOrder: 5,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.MultipleChoice,
                title:
                  "Which of the following are applications of AI in business? (Select all that apply)",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "Customer service chatbots",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Predictive analytics",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Supply chain optimization",
                    isCorrect: true,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Space exploration tools",
                    isCorrect: false,
                    displayOrder: 3,
                  },
                ],
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "AI Quiz: Can AI Function Without Data?",
            description: "Test your understanding of AI's reliance on data.",
            displayOrder: 6,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.TrueOrFalse,
                title: "AI can function without any data input from humans.",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "True",
                    isCorrect: false,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "False",
                    isCorrect: true,
                    displayOrder: 1,
                  },
                ],
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "Photo Identification: AI Solutions",
            description: "Identify the AI-driven solution from the provided images.",
            displayOrder: 7,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.PhotoQuestionSingleChoice,
                title: "Which image represents an AI-driven chatbot?",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "Image 1 (Chatbot Interface)",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Image 2 (Calculator)",
                    isCorrect: false,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Image 3 (Spreadsheet)",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                ],
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "AI Fill in the Blanks",
            description: "Complete the sentences with the correct AI-related terms.",
            displayOrder: 8,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.FillInTheBlanksDnd,
                title:
                  "Complete the blanks: Artificial [word] refers to the ability of machines to mimic [word] intelligence.",
                options: [
                  {
                    id: crypto.randomUUID(),
                    optionText: "Intelligence",
                    isCorrect: true,
                    displayOrder: 0,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Automation",
                    isCorrect: false,
                    displayOrder: 1,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Learning",
                    isCorrect: false,
                    displayOrder: 2,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Human",
                    isCorrect: true,
                    displayOrder: 3,
                  },
                  {
                    id: crypto.randomUUID(),
                    optionText: "Animal",
                    isCorrect: false,
                    displayOrder: 4,
                  },
                ],
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "Brief Response: Why Businesses Adopt AI",
            description: "Explain in one sentence why businesses adopt AI.",
            displayOrder: 9,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.BriefResponse,
                title: "In one sentence, explain why businesses are adopting AI.",
              },
            ],
          },
          {
            id: crypto.randomUUID(),
            type: LESSON_TYPES.QUIZ,
            title: "Detailed Response: AI's Role in an Industry",
            description: "Describe how AI can improve decision-making in a specific industry.",
            displayOrder: 10,
            questions: [
              {
                displayOrder: 1,
                id: crypto.randomUUID(),
                type: QuestionType.DetailedResponse,
                title:
                  "Describe how AI can improve decision-making in a specific industry of your choice.",
              },
            ],
          },
        ],
      },
    ],
  },
];
