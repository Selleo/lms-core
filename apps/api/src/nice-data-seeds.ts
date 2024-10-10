import { Status } from "./storage/schema/utils";

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
} as const;

export interface NiceCourseData {
  title: string;
  description: string;
  imageUrl?: string;
  state: keyof typeof Status;
  priceInCents: number;
  category: string;
  lessons: {
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
    title: "Introduction to Project Management: Essential Skills for Success",
    description:
      "This course introduces learners to the key principles and practices of project management. Ideal for those new to project management or looking to enhance their skills, the course covers the complete project lifecycle—from initiation and planning to execution and closure. You'll learn about defining project scope, managing resources, developing timelines, and controlling project risks. Through practical exercises and real-world case studies, students will gain the tools and knowledge to successfully manage projects of any size.",
    state: "published",
    priceInCents: 8500,
    category: "Business Management",
    imageUrl: "faker.image.urlPicsumPhotos()",
    lessons: [
      {
        title: "Project Lifecycle",
        description:
          "This lesson explores the phases of a project lifecycle, highlighting the importance of planning and stakeholder communication.",
        state: "published",
        items: [
          {
            type: "text_block",
            title: "Understanding Project Phases",
            body: "The project lifecycle includes initiation, planning, execution, and closure. Each phase has distinct tasks that ensure project success.",
            state: "published",
          },
          {
            type: "question",
            questionType: "multiple_choice",
            questionBody:
              "Which phase involves defining project objectives and deliverables? A) Initiation B) Planning C) Execution D) Closure",
            state: "published",
          },
        ],
      },
      {
        title: "Risk Management in Projects",
        description:
          "This lesson teaches risk identification and mitigation strategies that are vital for keeping projects on track.",
        state: "published",
        items: [
          {
            type: "text_block",
            title: "Identifying Risks",
            body: "Risk management is an integral part of project success. Identifying risks early allows for proper planning and mitigation.",
            state: "published",
          },
          {
            type: "question",
            questionType: "open_answer",
            questionBody:
              "Explain why risk management is critical in project management.",
            state: "published",
          },
        ],
      },
    ],
  },
  {
    title: "Marketing Analytics: Data-Driven Decision Making",
    description:
      "This course helps learners understand how data analytics can enhance marketing strategies. Ideal for those working in marketing or interested in entering the field, this course focuses on how to collect, analyze, and interpret marketing data to make informed decisions. Learners will explore tools and techniques for tracking customer behavior, measuring campaign performance, and predicting future trends.",
    state: "published",
    priceInCents: 10500,
    category: "Marketing",
    imageUrl: "faker.image.urlPicsumPhotos()",
    lessons: [
      {
        title: "Introduction to Marketing Analytics",
        description:
          "This lesson introduces marketing analytics and its role in driving data-informed decision-making in marketing strategies.",
        state: "published",
        items: [
          {
            type: "text_block",
            title: "Importance of Data in Marketing",
            body: "Marketing analytics involves analyzing customer data to improve marketing strategies, making campaigns more effective and tailored to target audiences.",
            state: "published",
          },
          {
            type: "question",
            questionType: "open_answer",
            questionBody:
              "How can marketers use customer data to improve campaign results?",
            state: "published",
          },
        ],
      },
      {
        title: "Measuring Campaign Performance",
        description:
          "This lesson focuses on how to measure the performance of marketing campaigns using metrics like return on investment (ROI), conversion rates, and customer engagement.",
        state: "published",
        items: [
          {
            type: "text_block",
            title: "Key Marketing Metrics",
            body: "Metrics such as ROI and conversion rates provide valuable insights into the effectiveness of marketing campaigns.",
            state: "published",
          },
          {
            type: "question",
            questionType: "multiple_choice",
            questionBody:
              "Which of the following is used to measure marketing campaign success? A) ROI B) Cost of Goods Sold C) Net Profit D) Customer Loyalty",
            state: "published",
          },
        ],
      },
    ],
  },
  {
    title: "Introduction to Software Testing: Ensuring Quality in Development",
    description:
      "This course introduces the fundamentals of software testing, focusing on ensuring the quality and functionality of software applications. Learners will explore different types of testing such as unit testing, integration testing, system testing, and user acceptance testing (UAT). The course emphasizes practical skills in writing test cases, identifying bugs, and collaborating with development teams to resolve issues. Ideal for those pursuing a career in quality assurance (QA) or developers looking to enhance their understanding of testing.",
    state: "published",
    priceInCents: 9200,
    category: "Software Development",
    imageUrl: "faker.image.urlPicsumPhotos()",
    lessons: [
      {
        title: "Introduction to Software Testing",
        description:
          "This lesson introduces the importance of testing in software development, highlighting the key testing methodologies and their role in delivering quality software.",
        state: "published",
        items: [
          {
            type: "text_block",
            title: "What is Software Testing?",
            body: "Software testing is the process of evaluating and verifying that a software product or application meets the specified requirements. It ensures the product is defect-free and works as expected.",
            state: "published",
          },
          {
            type: "question",
            questionType: "multiple_choice",
            questionBody:
              "Which type of testing is performed to ensure individual components work as expected? A) Unit Testing B) System Testing C) Integration Testing D) User Acceptance Testing",
            state: "published",
          },
        ],
      },
      {
        title: "Bug Identification and Resolution",
        description:
          "In this lesson, learners will explore how to identify bugs in software applications and work collaboratively with developers to resolve issues.",
        state: "published",
        items: [
          {
            type: "text_block",
            title: "How to Identify Bugs",
            body: "Bug identification is a key part of testing. It involves recognizing defects in the software that do not align with the requirements or functionality.",
            state: "published",
          },
          {
            type: "question",
            questionType: "open_answer",
            questionBody:
              "Why is communication between testers and developers crucial during the bug resolution process?",
            state: "published",
          },
        ],
      },
    ],
  },
  {
    title: "Web Design Basics: Building User-Friendly Websites",
    description:
      "This course introduces learners to the fundamental principles of web design. It covers user experience (UX), interface design, responsive design, and the basics of HTML and CSS. Ideal for those new to web development or anyone looking to improve their web design skills, the course focuses on creating websites that are both functional and visually appealing. By the end of the course, learners will have the ability to create responsive websites optimized for various devices.",
    state: "published",
    priceInCents: 7800,
    category: "Web Development",
    imageUrl: "faker.image.urlPicsumPhotos()",
    lessons: [
      {
        title: "Introduction to Web Design",
        description:
          "This lesson explores the key elements of web design, including layout, color schemes, and typography, and how they contribute to creating visually engaging websites.",
        state: "published",
        items: [
          {
            type: "text_block",
            title: "Understanding Design Principles",
            body: "Effective web design involves balancing aesthetics with functionality. Elements such as color, typography, and layout work together to create an engaging user experience.",
            state: "published",
          },
          {
            type: "question",
            questionType: "open_answer",
            questionBody:
              "Why is responsive design essential in modern web development?",
            state: "published",
          },
        ],
      },
      {
        title: "Responsive Design and Development",
        description:
          "In this lesson, learners will explore responsive design principles and how to build websites that adapt to different screen sizes.",
        state: "published",
        items: [
          {
            type: "text_block",
            title: "What is Responsive Design?",
            body: "Responsive design ensures that websites adapt seamlessly to different devices, providing an optimal user experience on both desktop and mobile platforms.",
            state: "published",
          },
          {
            type: "question",
            questionType: "multiple_choice",
            questionBody:
              "Which of the following technologies is commonly used in responsive design? A) Flexbox B) Grid Layout C) Media Queries D) All of the Above",
            state: "published",
          },
        ],
      },
    ],
  },
];
