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
            type: LESSON_TYPES.textBlock,
            title: "Introduction to HTML",
            description:
              "HTML (HyperText Markup Language) is the standard language used to create the structure of web pages. In this lesson, you'll explore basic HTML elements and how they are used to build the framework of a website.",
            displayOrder: 1,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "HTML Quiz: Importance of HTML",
            description: "Why is HTML considered the backbone of any website?",
            displayOrder: 2,
            questions: [
              {
                type: QuestionType.BriefResponse,
                title: "Why is HTML considered the backbone of any website?",
                description: "Explain its role in web development.",
              },
            ],
          },
          {
            type: LESSON_TYPES.video,
            title: "HTML Elements Video",
            description:
              "Learn the basics of web development with HTML! Master the structure and tags needed to build professional websites from scratch.",
            displayOrder: 3,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "CSS and Layout Quiz",
            description:
              "In CSS, [word] is used to style the layout, while [word] is used to change colors.",
            displayOrder: 4,
            questions: [
              {
                type: QuestionType.FillInTheBlanks,
                title:
                  "In CSS, [word] is used to style the layout, while [word] is used to change colors.",
                description:
                  "<p>In CSS, <strong>flexbox</strong> is used to style the layout, while <strong>color properties</strong> are used to change colors.</p>",
                options: [
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
            ],
          },
          {
            type: LESSON_TYPES.presentation,
            title: "HTML Hyperlinks Presentation",
            description:
              "Learn the basics of web development with HTML! Master the structure and tags needed to build professional websites from scratch.",
            displayOrder: 5,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "HTML Tag Quiz",
            description: "Which HTML tag is used to create a hyperlink?",
            displayOrder: 6,
            questions: [
              {
                type: QuestionType.SingleChoice,
                title: "Which HTML tag is used to create a hyperlink?",
                options: [
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
            type: LESSON_TYPES.quiz,
            title: "HTML Basics: Test Your Knowledge",
            description:
              "This lesson is designed to test your understanding of basic HTML concepts. You'll encounter a mix of multiple-choice and single-answer questions to evaluate your knowledge of HTML structure and common elements.",
            displayOrder: 1,
            questions: [
              {
                type: QuestionType.SingleChoice,
                title: "Which of the following HTML tags is used to create an image?",
                // displayOrder: 1,
                options: [
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
                type: QuestionType.MultipleChoice,
                title:
                  "Which of the following are valid HTML elements for structuring content? (Select all that apply)",
                // displayOrder: 2,
                options: [
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
                type: QuestionType.SingleChoice,
                title: "Which HTML tag is used to create a hyperlink?",
                // displayOrder: 3,
                options: [
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
                type: QuestionType.MultipleChoice,
                title:
                  "Which of the following attributes are commonly used with the <img> tag? (Select all that apply)",
                // displayOrder: 4,
                options: [
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
                type: QuestionType.FillInTheBlanks,
                title:
                  "CSS is used to style [word], while JavaScript is used to add [word] to web pages.",
                // displayOrder: 5,
                description:
                  "<p>CSS is used to style <strong>HTML</strong>, while JavaScript is used to add <strong>interactivity</strong> to web pages.</p>",
                options: [
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
                type: QuestionType.FillInTheBlanks,
                // displayOrder: 6,
                title:
                  "In CSS, [word] is used to style the layout, while [word] is used to change colors.",
                description:
                  "<p>In CSS, <strong>flexbox</strong> is used to style the layout, while <strong>color properties</strong> are used to change colors.</p>",
                options: [
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
                type: QuestionType.FillInTheBlanks,
                // displayOrder: 7,
                title:
                  "In JavaScript, [word] are used to store data, while [word] are used to perform actions.",
                description:
                  "<p>In JavaScript, <strong>variables</strong> are used to store data, while <strong>functions</strong> are used to perform actions.</p>",
                options: [
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
            type: LESSON_TYPES.quiz,
            title: "CSS Fundamentals: Put Your Skills to the Test",
            description:
              "This lesson is a comprehensive quiz to evaluate your understanding of CSS fundamentals. You'll face a variety of question types covering selectors, properties, and layout techniques.",
            displayOrder: 1,
            questions: [
              {
                type: QuestionType.SingleChoice,
                title: "Which CSS property is used to change the text color of an element?",
                options: [
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
                type: QuestionType.MultipleChoice,
                title: "Which of the following are valid CSS selectors? (Select all that apply)",
                // displayOrder: 2,
                options: [
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
                type: QuestionType.FillInTheBlanks,
                title:
                  "The CSS [word] property is used for creating flexible box layouts, while [word] is used for creating grid layouts.",
                description:
                  "<p>The CSS <strong>flexbox</strong> property is used for creating flexible box layouts, while <strong>color properties</strong> are used for creating grid layouts.</p>",
                // displayOrder: 3,
                options: [
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
                type: QuestionType.FillInTheBlanks,
                // displayOrder: 4,
                title: "To center an element horizontally, you can use 'margin: [word] [word];'.",
                description:
                  "<p>To center an element horizontally, you can use 'margin: <strong>0 auto</strong>;'.</p>",
                options: [
                  {
                    optionText: "0",
                    isCorrect: true,
                    position: 0,
                  },
                  {
                    optionText: "auto",
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
        title: "HTML Basics: Building the Structure of Your Website",
        isPublished: true,
        isFreemium: false,
        displayOrder: 4,
        lessons: [
          {
            type: LESSON_TYPES.textBlock,
            title: "Introduction to HTML",
            description:
              "HTML (HyperText Markup Language) is the standard language used to create the structure of web pages. In this lesson, you'll explore basic HTML elements and how they are used to build the framework of a website.",
            displayOrder: 1,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "HTML Quiz: Importance of HTML",
            description: "Why is HTML considered the backbone of any website?",
            displayOrder: 2,
            questions: [
              {
                type: QuestionType.BriefResponse,
                title:
                  "Why is HTML considered the backbone of any website? Explain its role in web development.",
              },
            ],
          },
          {
            type: LESSON_TYPES.video,
            title: "HTML Elements Video",
            description:
              "Learn the basics of web development with HTML! Master the structure and tags needed to build professional websites from scratch.",
            displayOrder: 3,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "CSS and Layout Quiz",
            description:
              "In CSS, [word] is used to style the layout, while [word] is used to change colors.",
            displayOrder: 4,
            questions: [
              {
                type: QuestionType.FillInTheBlanks,
                title:
                  "In CSS, [word] is used to style the layout, while [word] is used to change colors.",
                description:
                  "<p>In CSS, <strong>flexbox</strong> is used to style the layout, while <strong>color properties</strong> are used to change colors.</p>",
                options: [
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
            type: LESSON_TYPES.textBlock,
            title: "Introduction to Java for Android",
            description:
              "Java is the primary language used for Android app development. In this lesson, you'll learn about Java syntax, data types, and object-oriented programming principles that form the foundation of Android development.",
            displayOrder: 1,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "Explain why Java is the preferred language for Android development",
            description: "",
            displayOrder: 2,
            questions: [
              {
                type: QuestionType.BriefResponse,
                title: "Explain why Java is the preferred language for Android development.",
                description: "",
              },
            ],
          },
          {
            type: LESSON_TYPES.video,
            title: "Java Basics Video Tutorial",
            description: "Learn Java basics for Android development.",
            displayOrder: 3,
          },
          {
            type: LESSON_TYPES.quiz,
            title:
              "In Java, [word] are used to define the blueprint of objects, while [word] are instances.",
            description: "",
            displayOrder: 4,
            questions: [
              {
                type: QuestionType.FillInTheBlanks,
                title:
                  "In Java, [word] are used to define the blueprint of objects, while [word] are instances.",
                description:
                  "<p>In Java, <strong>classes</strong> are used to define the blueprint of objects, while <strong>objects</strong> are instances of these blueprints.</p>",
                options: [
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
            ],
          },
          {
            type: LESSON_TYPES.quiz,
            title:
              "In Android dev, [word] are used to define the user interface, while [word] handle user interactions",
            description: "",
            displayOrder: 5,
            questions: [
              {
                type: QuestionType.FillInTheBlanks,
                title:
                  "In Android dev, [word] are used to define the user interface, while [word] handle user interactions.",
                description:
                  "<p>In Android development, <strong>layouts</strong> are used to define the user interface, while <strong>activities</strong> handle user interactions and app logic.</p>",
                options: [
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
            ],
          },
          {
            type: LESSON_TYPES.presentation,
            title: "Java OOP Concepts Presentation",
            description: "Explore Object-Oriented Programming principles in Java.",
            displayOrder: 6,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "Which keyword is used to create a new instance of a class in Java?",
            description: "",
            displayOrder: 7,
            questions: [
              {
                type: QuestionType.SingleChoice,
                title: "Which keyword is used to create a new instance of a class in Java?",
                options: [
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
            type: LESSON_TYPES.quiz,
            title: "Which of the following is the entry point of an Android application?",
            description: "",
            displayOrder: 1,
            questions: [
              {
                type: QuestionType.SingleChoice,
                title: "Which of the following is the entry point of an Android application?",
                options: [
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
            type: LESSON_TYPES.textBlock,
            title: "Introduction to Kotlin for Android",
            description:
              "Kotlin is a modern, concise language used for Android development. In this lesson, you'll learn about Kotlin syntax and basic concepts for creating Android apps.",
            displayOrder: 1,
          },
          {
            type: LESSON_TYPES.video,
            title: "Kotlin Basics Video Tutorial",
            description:
              "A video tutorial to help you learn Kotlin syntax, object-oriented principles, and how to apply them to Android development.",
            displayOrder: 2,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "Which keyword is used to declare a variable in Kotlin?",
            description: "",
            displayOrder: 3,
            questions: [
              {
                type: QuestionType.SingleChoice,
                title: "Which keyword is used to declare a variable in Kotlin?",
                options: [
                  { optionText: "var", isCorrect: true, position: 0 },
                  { optionText: "val", isCorrect: false, position: 1 },
                  { optionText: "let", isCorrect: false, position: 2 },
                  { optionText: "data", isCorrect: false, position: 3 },
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
            type: LESSON_TYPES.textBlock,
            title: "Setting Up Your Android Studio Environment",
            description:
              "Learn how to configure Android Studio for Kotlin development and create your first Android project.",
            displayOrder: 1,
          },
          {
            type: LESSON_TYPES.presentation,
            title: "Creating a Simple Kotlin App",
            description: "A step-by-step guide to building your first Android app using Kotlin.",
            displayOrder: 2,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "In Kotlin, [word] are immutable variables, while [word] are mutable variables.",
            description: "",
            displayOrder: 3,
            questions: [
              {
                type: QuestionType.FillInTheBlanks,
                title:
                  "In Kotlin, [word] are immutable variables, while [word] are mutable variables.",
                description:
                  "<p>In Kotlin, <strong>val</strong> are immutable variables, while <strong>var</strong> are mutable variables.</p>",
                options: [
                  { optionText: "val", isCorrect: true, position: 0 },
                  { optionText: "var", isCorrect: true, position: 1 },
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
            type: LESSON_TYPES.textBlock,
            title: "Introduction to Arithmetic",
            description:
              "Arithmetic is the foundation of mathematics. In this lesson, you'll learn about numbers, basic operations, and their properties.",
            displayOrder: 1,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "Why is arithmetic considered the foundation of mathematics? ",
            description: "",
            displayOrder: 2,
            questions: [
              {
                type: QuestionType.BriefResponse,
                title:
                  "Why is arithmetic fundamental in math? Give a real-life example of its use.",
              },
            ],
          },
          {
            type: LESSON_TYPES.video,
            title: "Basic Arithmetic Video Tutorial",
            description:
              "Learn the basics of arithmetic operations and how to use them in problem-solving scenarios.",
            displayOrder: 3,
          },
          {
            type: LESSON_TYPES.quiz,
            title:
              "In arithmetic, [word] is the result of addition, while [word] is the result of subtraction.",
            description: "",
            displayOrder: 4,
            questions: [
              {
                type: QuestionType.FillInTheBlanks,
                title:
                  "In arithmetic, [word] is the result of addition, while [word] is the result of subtraction.",
                description:
                  "<p>In arithmetic, <strong>sum</strong> is the result of addition, while <strong>difference</strong> is the result of subtraction.</p>",
                options: [
                  { optionText: "sum", isCorrect: true, position: 0 },
                  { optionText: "difference", isCorrect: true, position: 1 },
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
            type: LESSON_TYPES.textBlock,
            title: "Understanding Geometry",
            description:
              "Geometry involves the study of shapes, sizes, and the properties of space. In this lesson, you'll learn about basic geometric figures and their properties.",
            displayOrder: 1,
          },
          {
            type: LESSON_TYPES.presentation,
            title: "Geometric Shapes Presentation",
            description:
              "Explore various geometric shapes, their formulas for area and perimeter, and their real-life applications.",
            displayOrder: 2,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "Which formula is used to calculate the area of a rectangle?",
            description: "",
            displayOrder: 3,
            questions: [
              {
                type: QuestionType.SingleChoice,
                title: "Which formula is used to calculate the area of a rectangle?",
                options: [
                  { optionText: "length × width", isCorrect: true, position: 0 },
                  { optionText: "length + width", isCorrect: false, position: 1 },
                  { optionText: "length × height", isCorrect: false, position: 2 },
                  { optionText: "2 × (length + width)", isCorrect: false, position: 3 },
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
            type: LESSON_TYPES.textBlock,
            title: "Getting Started with Algebra",
            description:
              "Algebra helps us solve problems by finding unknown values. In this lesson, you'll learn about variables, expressions, and simple equations.",
            displayOrder: 1,
          },
          {
            type: LESSON_TYPES.quiz,
            title:
              "In algebra, [word] represent unknown values, while [word] are mathematical phrases",
            description: "",
            displayOrder: 2,
            questions: [
              {
                type: QuestionType.FillInTheBlanks,
                title:
                  "In algebra, [word] represent unknown values, while [word] are mathematical phrases",
                description:
                  "<p>In algebra, <strong>variables</strong> represent unknown values, while <strong>expressions</strong> are mathematical phrases that combine numbers and variables.</p>",
                options: [
                  { optionText: "variables", isCorrect: true, position: 0 },
                  { optionText: "expressions", isCorrect: true, position: 1 },
                ],
              },
            ],
          },
          {
            type: LESSON_TYPES.video,
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
            type: LESSON_TYPES.quiz,
            title: "Mathematics Basics Quiz: Test Your Knowledge",
            description:
              "Evaluate your understanding of arithmetic, geometry, and algebra with this comprehensive quiz.",
            displayOrder: 1,
            questions: [
              {
                type: QuestionType.SingleChoice,
                title: "Which of the following is an example of a geometric shape?",
                options: [
                  { optionText: "Triangle", isCorrect: true, position: 0 },
                  { optionText: "Variable", isCorrect: false, position: 1 },
                  { optionText: "Equation", isCorrect: false, position: 2 },
                  { optionText: "Sum", isCorrect: false, position: 3 },
                ],
              },
              {
                type: QuestionType.MultipleChoice,
                title: "Which operations are included in basic arithmetic? (Select all that apply)",
                options: [
                  { optionText: "Addition", isCorrect: true, position: 0 },
                  { optionText: "Subtraction", isCorrect: true, position: 1 },
                  { optionText: "Multiplication", isCorrect: true, position: 2 },
                  { optionText: "Division", isCorrect: true, position: 3 },
                  { optionText: "Integration", isCorrect: false, position: 4 },
                ],
              },
              {
                type: QuestionType.FillInTheBlanks,
                title:
                  "In algebra, [word] are used to represent unknowns, while [word] can be solved to find their values.",
                description:
                  "<p>In algebra, <strong>variables</strong> are used to represent unknowns, while <strong>equations</strong> can be solved to find their values.</p>",
                options: [
                  { optionText: "variables", isCorrect: true, position: 0 },
                  { optionText: "equations", isCorrect: true, position: 1 },
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
            type: LESSON_TYPES.textBlock,
            title: "Introduction to English Grammar",
            description:
              "Learn the essential grammar rules that form the backbone of English communication, covering nouns, verbs, adjectives, and more.",
            displayOrder: 1,
          },
          {
            type: LESSON_TYPES.textBlock,
            title: "Sentence Structure Basics",
            description:
              "Explore how sentences are structured, including subject-verb agreement and word order in affirmative, negative, and question forms.",
            displayOrder: 2,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "Explain the difference between a noun and a verb in a sentence.",
            description: "Explain the difference between a noun and a verb in a sentence.",
            displayOrder: 3,
            questions: [
              {
                type: QuestionType.BriefResponse,
                title: "Explain the difference between a noun and a verb in a sentence.",
                description: "Explain its role in sentence construction.",
              },
            ],
          },
          {
            type: LESSON_TYPES.video,
            title: "Grammar Rules Video Tutorial",
            description:
              "Watch this tutorial to get a comprehensive overview of essential English grammar rules.",
            displayOrder: 4,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "Fill in the blanks: 'She [word] to the store yesterday.'",
            description: "Fill in the blanks with the correct verb.",
            displayOrder: 5,
            questions: [
              {
                type: QuestionType.FillInTheBlanks,
                title: "Fill in the blanks: 'She [word] to the store yesterday.'",
                description: "<p>She <strong>went</strong> to the store yesterday.</p>",
                options: [
                  { optionText: "went", isCorrect: true, position: 0 },
                  { optionText: "go", isCorrect: false, position: 1 },
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
            type: LESSON_TYPES.textBlock,
            title: "Common English Words and Phrases",
            description:
              "A beginner-friendly list of common English words and phrases you can use in daily conversations.",
            displayOrder: 1,
          },
          {
            type: LESSON_TYPES.textBlock,
            title: "Synonyms and Antonyms",
            description:
              "Learn about the importance of synonyms and antonyms in expanding your vocabulary and making your speech more varied.",
            displayOrder: 2,
          },
          {
            type: LESSON_TYPES.presentation,
            title: "English Vocabulary Expansion Presentation",
            description: "A comprehensive slide presentation on expanding your vocabulary.",
            displayOrder: 3,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "Which word is the synonym of 'happy'?",
            description: "Choose the correct synonym for 'happy'.",
            displayOrder: 4,
            questions: [
              {
                type: QuestionType.SingleChoice,
                title: "Which word is the synonym of 'happy'?",
                options: [
                  { optionText: "Joyful", isCorrect: true, position: 0 },
                  { optionText: "Sad", isCorrect: false, position: 1 },
                  { optionText: "Angry", isCorrect: false, position: 2 },
                ],
              },
            ],
          },
          {
            type: LESSON_TYPES.quiz,
            title: "I [word] to the park every day.",
            description: "Fill in the blank with the correct verb.",
            displayOrder: 5,
            questions: [
              {
                type: QuestionType.FillInTheBlanks,
                title: "I [word] to the park every day.",
                options: [
                  { optionText: "go", isCorrect: true, position: 0 },
                  { optionText: "went", isCorrect: false, position: 1 },
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
            type: LESSON_TYPES.textBlock,
            title: "Essential Pronunciation Tips",
            description:
              "Learn how to pronounce English words correctly and improve your accent with practical tips and exercises.",
            displayOrder: 1,
          },
          {
            type: LESSON_TYPES.textBlock,
            title: "Common Pronunciation Mistakes",
            description:
              "Identify and work on common pronunciation challenges for non-native English speakers.",
            displayOrder: 2,
          },
          {
            type: LESSON_TYPES.quiz,
            title:
              "Which of the following sounds is most commonly mispronounced by non-native English speakers?",
            description: "Choose the sound that is most commonly mispronounced.",
            displayOrder: 3,
            questions: [
              {
                type: QuestionType.SingleChoice,
                title:
                  "Which of the following sounds is most commonly mispronounced by non-native English speakers?",
                options: [
                  { optionText: "Th", isCorrect: true, position: 0 },
                  { optionText: "S", isCorrect: false, position: 1 },
                  { optionText: "K", isCorrect: false, position: 2 },
                ],
              },
            ],
          },
          {
            type: LESSON_TYPES.video,
            title: "Pronunciation and Accent Video Tutorial",
            description: "A step-by-step video guide on mastering English pronunciation.",
            displayOrder: 4,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "I love [word] (swimming/swim).",
            description: "Choose the correct verb form.",
            displayOrder: 5,
            questions: [
              {
                type: QuestionType.FillInTheBlanks,
                title: "I love [word] (swimming/swim).",
                description: "I love <strong>swimming</strong> (swimming/swim).",
                options: [{ optionText: "swimming", isCorrect: true, position: 0 }],
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
            type: LESSON_TYPES.quiz,
            title:
              "Which part of speech is the word 'quickly' in the sentence 'She ran quickly to the store'?",
            description: "Choose the correct part of speech.",
            displayOrder: 1,
            questions: [
              {
                type: QuestionType.SingleChoice,
                title:
                  "Which part of speech is the word 'quickly' in the sentence 'She ran quickly to the store'?",
                options: [
                  { optionText: "Adverb", isCorrect: true, position: 0 },
                  { optionText: "Verb", isCorrect: false, position: 1 },
                  { optionText: "Adjective", isCorrect: false, position: 2 },
                ],
              },
            ],
          },
          {
            type: LESSON_TYPES.quiz,
            title: "She [word] to the park every day.",
            description: "Fill in the blank with the correct verb.",
            displayOrder: 2,
            questions: [
              {
                type: QuestionType.FillInTheBlanks,
                title: "She [word] to the park every day.",
                description: "She <strong>went</strong> to the park every day.",
                options: [
                  { optionText: "goes", isCorrect: true, position: 0 },
                  { optionText: "went", isCorrect: false, position: 1 },
                ],
              },
            ],
          },
          {
            type: LESSON_TYPES.quiz,
            title: "What is the plural form of 'child'?",
            description: "Choose the correct plural form of 'child'.",
            displayOrder: 3,
            questions: [
              {
                type: QuestionType.SingleChoice,
                title: "What is the plural form of 'child'?",
                options: [
                  { optionText: "Children", isCorrect: true, position: 0 },
                  { optionText: "Childs", isCorrect: false, position: 1 },
                ],
              },
            ],
          },
          {
            type: LESSON_TYPES.quiz,
            title: "Which of these words is a conjunction?",
            description: "Choose the correct conjunction.",
            displayOrder: 4,
            questions: [
              {
                type: QuestionType.SingleChoice,
                title: "Which of these words is a conjunction?",
                options: [
                  { optionText: "And", isCorrect: true, position: 0 },
                  { optionText: "Run", isCorrect: false, position: 1 },
                  { optionText: "Quickly", isCorrect: false, position: 2 },
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
            type: LESSON_TYPES.textBlock,
            title: "Complex Sentences and Their Use",
            description:
              "Learn how to form and use complex sentences to convey more detailed thoughts and ideas effectively.",
            displayOrder: 1,
          },
          {
            type: LESSON_TYPES.textBlock,
            title: "Relative Clauses and Modifiers",
            description:
              "A deep dive into relative clauses and modifiers, which help to add extra information to sentences.",
            displayOrder: 2,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "What is the difference between a relative clause and a noun clause?",
            description: "Explain the difference between relative and noun clauses.",
            displayOrder: 3,
          },
          {
            type: LESSON_TYPES.video,
            title: "Advanced Grammar Video Tutorial",
            description:
              "Watch this in-depth video to understand complex sentence structures and advanced grammar.",
            displayOrder: 4,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "Fill in the blanks: The book [word] I borrowed yesterday was fascinating.",
            description: "Fill in the blank with the correct word.",
            displayOrder: 5,
            questions: [
              {
                type: QuestionType.FillInTheBlanks,
                title: "The book [word] I borrowed yesterday was fascinating.",
                description: "The book <strong>that</strong> I borrowed yesterday was fascinating.",
                options: [
                  { optionText: "that", isCorrect: true, position: 0 },
                  { optionText: "who", isCorrect: false, position: 1 },
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
            type: LESSON_TYPES.textBlock,
            title: "Academic Vocabulary and Its Application",
            description:
              "Master vocabulary words commonly used in academic papers, essays, and formal discussions.",
            displayOrder: 1,
          },
          {
            type: LESSON_TYPES.textBlock,
            title: "Using Formal Language in Communication",
            description:
              "Learn how to adjust your language for formal situations, such as presentations or professional meetings.",
            displayOrder: 2,
          },
          {
            type: LESSON_TYPES.presentation,
            title: "Academic Vocabulary List",
            description:
              "Download this list of academic vocabulary and explore their meanings and usage in context.",
            displayOrder: 3,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "Which word is an example of academic vocabulary?",
            description: "Select the correct academic word.",
            displayOrder: 4,
            questions: [
              {
                type: QuestionType.SingleChoice,
                title: "Which word is an example of academic vocabulary?",
                options: [
                  { optionText: "Analyze", isCorrect: true, position: 0 },
                  { optionText: "Run", isCorrect: false, position: 1 },
                  { optionText: "Quick", isCorrect: false, position: 2 },
                ],
              },
            ],
          },
          {
            type: LESSON_TYPES.quiz,
            title: "The results [word] the hypothesis.",
            description: "Fill in the blank with the correct word.",
            displayOrder: 5,
            questions: [
              {
                type: QuestionType.FillInTheBlanks,
                title: "The results [word] the hypothesis.",
                description: "The results <strong>support</strong> the hypothesis.",
                options: [{ optionText: "support", isCorrect: true, position: 0 }],
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
            type: LESSON_TYPES.textBlock,
            title: "Understanding Idioms in Context",
            description:
              "Learn how idiomatic expressions are used in everyday conversations to sound more natural and fluent.",
            displayOrder: 1,
          },
          {
            type: LESSON_TYPES.textBlock,
            title: "Common Idioms and Their Meanings",
            description:
              "A list of frequently used idioms, their meanings, and examples of how to use them.",
            displayOrder: 2,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "What does the idiom 'break the ice' mean?",
            description: "Explain the meaning of the idiom 'break the ice'.",
            displayOrder: 3,
          },
          {
            type: LESSON_TYPES.video,
            title: "Idiomatic Expressions Video Tutorial",
            description:
              "Watch this video to learn how to use idiomatic expressions in real conversations.",
            displayOrder: 4,
          },
          {
            type: LESSON_TYPES.quiz,
            title: "She was [word] when she heard the good news.",
            description: "Fill in the blank with the correct idiom.",
            displayOrder: 5,
            questions: [
              {
                type: QuestionType.FillInTheBlanks,
                title: "She was [word] when she heard the good news.",
                description: "She was <strong>over the moon</strong> when she heard the good news.",
                options: [{ optionText: "over the moon", isCorrect: true, position: 0 }],
              },
            ],
          },
        ],
      },
    ],
  },

  // {
  //   type: LESSON_TYPE.multimedia.key,
  //   title: "Advanced Writing Skills: Crafting Cohesive Paragraphs",
  //   description:
  //     "Learn how to write complex, well-structured paragraphs that convey your ideas clearly and persuasively in advanced writing contexts.",
  //   state: STATUS.published.key,
  //   imageUrl: faker.image.urlPicsumPhotos(),
  //   isFree: false,
  //   items: [
  //     {
  //       itemType: LESSON_ITEM_TYPE.text_block.key,
  //       title: "Topic Sentences and Supporting Details",
  //       body: "Learn how to craft a clear topic sentence and use supporting details effectively in your writing.",
  //       state: STATUS.published.key,
  //     },
  //     {
  //       itemType: LESSON_ITEM_TYPE.text_block.key,
  //       title: "Transitions and Coherence in Writing",
  //       body: "Understand the importance of transitions and coherence to make your paragraphs flow logically.",
  //       state: STATUS.published.key,
  //     },
  //     {
  //       itemType: LESSON_ITEM_TYPE.file.key,
  //       title: "Paragraph Writing Practice",
  //       type: LESSON_FILE_TYPE.external_presentation.key,
  //       state: STATUS.published.key,
  //       body: "Download this practice worksheet to improve your paragraph writing skills.",
  //     },
  //     {
  //       itemType: LESSON_ITEM_TYPE.question.key,
  //       questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
  //       title:
  //         "The introduction [word] should [word] the main points [word] in the essay.",
  //       state: STATUS.published.key,
  //       solutionExplanation:
  //         "The introduction <strong>paragraph</strong> should <strong>outline</strong> the main points <strong>discussed</strong> in the essay.",
  //       questionAnswers: [
  //         {
  //           optionText: "paragraph",
  //           isCorrect: true,
  //           position: 0,
  //         },
  //         {
  //           optionText: "outline",
  //           isCorrect: true,
  //           position: 1,
  //         },
  //         {
  //           optionText: "discussed",
  //           isCorrect: true,
  //           position: 2,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   type: LESSON_TYPE.multimedia.key,
  //   title: "Public Speaking: Delivering a Persuasive Speech",
  //   description:
  //     "Develop your public speaking skills by learning how to structure and deliver a persuasive speech that captivates your audience.",
  //   state: STATUS.published.key,
  //   imageUrl: faker.image.urlPicsumPhotos(),
  //   isFree: false,
  //   items: [
  //     {
  //       itemType: LESSON_ITEM_TYPE.text_block.key,
  //       title: "Structuring a Persuasive Speech",
  //       body: "Learn the key components of a persuasive speech, including introduction, body, and conclusion.",
  //       state: STATUS.published.key,
  //     },
  //     {
  //       itemType: LESSON_ITEM_TYPE.text_block.key,
  //       title: "Techniques for Engaging Your Audience",
  //       body: "Discover techniques such as storytelling, rhetorical questions, and powerful language to keep your audience engaged.",
  //       state: STATUS.published.key,
  //     },
  //     {
  //       itemType: LESSON_ITEM_TYPE.question.key,
  //       questionType: QUESTION_TYPE.single_choice.key,
  //       title: "What is the purpose of the conclusion in a persuasive speech?",
  //       state: STATUS.published.key,
  //       questionAnswers: [
  //         {
  //           optionText: "Summarize the main points",
  //           isCorrect: true,
  //           position: 0,
  //         },
  //         {
  //           optionText: "Introduce new information",
  //           isCorrect: false,
  //           position: 1,
  //         },
  //       ],
  //     },
  //     {
  //       itemType: LESSON_ITEM_TYPE.file.key,
  //       title: "Persuasive Speech Example",
  //       type: LESSON_FILE_TYPE.external_video.key,
  //       state: STATUS.published.key,
  //       body: "Listen to this persuasive speech example to see effective techniques in action.",
  //     },
  //   ],
  // },
  // {
  //   type: LESSON_TYPE.quiz.key,
  //   title: "Advanced English Quiz: Test Your Knowledge",
  //   description:
  //     "Test your mastery of advanced English skills, including grammar, vocabulary, idioms, writing, and public speaking.",
  //   state: STATUS.published.key,
  //   imageUrl: faker.image.urlPicsumPhotos(),
  //   isFree: false,
  //   items: [
  //     {
  //       itemType: LESSON_ITEM_TYPE.question.key,
  //       questionType: QUESTION_TYPE.single_choice.key,
  //       title: "Which sentence is an example of a complex sentence?",
  //       state: STATUS.published.key,
  //       questionAnswers: [
  //         {
  //           optionText: "She went to the store, and he stayed home.",
  //           isCorrect: false,
  //           position: 0,
  //         },
  //         {
  //           optionText: "Although it was raining, she went for a walk.",
  //           isCorrect: true,
  //           position: 1,
  //         },
  //       ],
  //     },
  //     {
  //       itemType: LESSON_ITEM_TYPE.question.key,
  //       questionType: QUESTION_TYPE.single_choice.key,
  //       title: "Which idiom means 'to be very happy'?",
  //       state: STATUS.published.key,
  //       questionAnswers: [
  //         {
  //           optionText: "On cloud nine",
  //           isCorrect: true,
  //           position: 0,
  //         },
  //         {
  //           optionText: "Hit the nail on the head",
  //           isCorrect: false,
  //           position: 1,
  //         },
  //       ],
  //     },
  //     {
  //       itemType: LESSON_ITEM_TYPE.question.key,
  //       questionType: QUESTION_TYPE.fill_in_the_blanks_text.key,
  //       title: "The manager will [word] the team meeting [word].",
  //       state: STATUS.published.key,
  //       solutionExplanation:
  //         "The manager will <strong>lead</strong> the team meeting <strong>tomorrow</strong>.",
  //       questionAnswers: [
  //         {
  //           optionText: "lead",
  //           isCorrect: true,
  //           position: 0,
  //         },
  //         {
  //           optionText: "tomorrow",
  //           isCorrect: true,
  //           position: 1,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // ],
  // },
];
