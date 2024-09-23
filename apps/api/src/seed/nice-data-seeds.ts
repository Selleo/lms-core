import { faker } from "@faker-js/faker";
import { Status } from "../storage/schema/utils";

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
  fill_in_the_blanks: "Fill in the blanks",
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
    title: "Foundations of Accounting: Principles and Practices",
    description:
      "This comprehensive course is designed for beginners and intermediate learners who aim to grasp essential concepts and practices of accounting. Whether you're aiming to boost your career, manage your business finances more effectively, or simply deepen your understanding of accounting, this course offers a step-by-step guide through financial transactions, bookkeeping, financial statements, and managerial accounting. Through a blend of theoretical concepts and practical applications, learners will gain a solid foundation in accounting principles, understand how to analyze financial data, and make informed decisions based on financial information.",
    state: "published",
    priceInCents: 9900,
    category: "Accounting and Finance",
    imageUrl: faker.image.urlPicsumPhotos(),
    lessons: [
      {
        title: "Introduction to Accounting Principles",
        description:
          'Welcome to the first lesson of our Foundations of Accounting course. In this lesson, we embark on a journey to understand fundamental principles that form the backbone of accounting. Accounting, often referred to as the "language of business," plays a crucial role in recording financial transactions, summarizing those transactions, and presenting them in the form of financial statements. Our exploration will begin with definitions and concepts of accounting, followed by an in-depth look at principles that guide accounting practices worldwide.',
        state: "published",
        items: [],
      },
      {
        title: "Recording Financial Transactions",
        description:
          "This lesson focuses on the process of recording financial transactions. Recording financial transactions ensures all financial activities within a business are accurately captured, categorized, and recorded. This process begins with the identification of a transaction, such as a sale, purchase, payment, or receipt of money. Each transaction is recorded in its respective journal, such as the sales journal or purchases journal. After transactions are recorded in journals, they are posted to the ledger, which shows changes made to each account and provides a comprehensive view of a company's financial status.",
        state: "published",
        items: [],
      },
      {
        title: "Financial Statements",
        description:
          "Financial statements serve as formal records of the financial activities and position of a business. These statements are indispensable tools for managers, investors, creditors, and other stakeholders to make informed decisions. The primary financial statements include the Income Statement, Balance Sheet, and Cash Flow Statement. The Income Statement summarizes revenues and expenses, the Balance Sheet presents a snapshot of financial position, and the Cash Flow Statement details cash inflows and outflows. These statements follow accounting principles and standards to ensure accuracy and comparability.",
        state: "published",
        items: [
          {
            type: "question",
            questionType: "open_answer",
            questionBody:
              "Why are financial statements considered crucial tools for stakeholders in making informed decisions? Discuss the roles of the Income Statement, Balance Sheet, and Cash Flow Statement in this context.",
            state: "published",
          },
          {
            type: "question",
            questionType: "open_answer",
            questionBody:
              "How do the principles of accounting ensure the accuracy, consistency, and comparability of financial statements across different periods and entities?",
            state: "published",
          },
          {
            type: "question",
            questionType: "open_answer",
            questionBody:
              "Reflect on the importance of analyzing financial statements. How can trends in revenue, expenses, and balance sheet items inform predictions about a company's future financial condition?",
            state: "published",
          },
        ],
      },
      {
        title: "Managerial Accounting and Decision Making",
        description:
          "This lesson explores the role of managerial accounting in guiding strategic decision-making processes within organizations. Managerial accounting plays a pivotal role in guiding the strategic decision-making processes within organizations. Unlike financial accounting, which focuses on providing information to external stakeholders, managerial accounting delivers detailed, relevant insights to internal managers to aid in planning, directing, and controlling business operations. It encompasses a range of activities, including budgeting, forecasting, cost analysis, and performance evaluation, all designed to help managers make informed decisions that enhance operational efficiency and drive profitability.",
        state: "published",
        items: [],
      },
      {
        title: "Other Topics in Accounting",
        description:
          "This lesson covers additional important topics in accounting.",
        state: "published",
        items: [
          {
            type: "file",
            title: "Other Topics in Accounting Presentation",
            fileType: "external_presentation",
            url: "https://res.cloudinary.com/dinpapxzv/raw/upload/v1727104719/presentation_gp0o3d.pptx",
            state: "published",
          },
        ],
      },
    ],
  },
];
