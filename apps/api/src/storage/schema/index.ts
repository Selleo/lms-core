import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { UserRoles } from "src/users/schemas/user-roles";
import { archived, id, timestamps } from "./utils";

export const users = pgTable("users", {
  ...id,
  ...timestamps,
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default(UserRoles.student),
  archived,
});

export const credentials = pgTable("credentials", {
  ...id,
  ...timestamps,
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  password: text("password").notNull(),
});

export const categories = pgTable("categories", {
  ...id,
  title: text("title").notNull().unique(),
  ...timestamps,
  archived,
});

export const createTokens = pgTable("create_tokens", {
  ...id,
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createToken: text("create_token").notNull(),
  expiryDate: timestamp("expiry_date", {
    precision: 3,
    withTimezone: true,
  }).notNull(),
  ...timestamps,
});

export const resetTokens = pgTable("reset_tokens", {
  ...id,
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  resetToken: text("reset_token").notNull(),
  expiryDate: timestamp("expiry_date", {
    precision: 3,
    withTimezone: true,
  }).notNull(),
  ...timestamps,
});

export const courses = pgTable("courses", {
  ...id,
  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 1000 }),
  imageUrl: varchar("image_url"),
  state: varchar("state").notNull().default("draft"),
  priceInCents: integer("price_in_cents").notNull().default(0),
  authorId: uuid("author_id")
    .references(() => users.id)
    .notNull(),
  categoryId: uuid("category_id")
    .references(() => categories.id)
    .notNull(),
  archived: boolean("archived").notNull().default(false),
  ...timestamps,
});

export const lessons = pgTable("lessons", {
  ...id,
  ...timestamps,
  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 1000 }),
  imageUrl: text("image_url"),
  authorId: uuid("author_id")
    .references(() => users.id)
    .notNull(),
  state: text("state").notNull().default("draft"),
  archived,
});

export const conversations = pgTable("conversations", {
  ...id,
  ...timestamps,
  participant1Id: uuid("participant1_id")
    .references(() => users.id)
    .notNull(),
  participant2Id: uuid("participant2_id")
    .references(() => users.id)
    .notNull(),
});

export const conversationMessages = pgTable("conversation_messages", {
  ...id,
  ...timestamps,
  message: text("message").notNull(),
  conversationId: uuid("conversation_id")
    .references(() => conversations.id)
    .notNull(),
  authorId: uuid("author_id")
    .references(() => users.id)
    .notNull(),
  readAt: timestamp("read_at", {
    mode: "string",
    withTimezone: true,
    precision: 3,
  }),
});

export const questions = pgTable("questions", {
  ...id,
  ...timestamps,
  questionType: text("question_type").notNull(),
  questionBody: text("question_body").notNull(),
  solutionExplanation: text("solution_explanation"),
  state: text("state").notNull().default("draft"),
  authorId: uuid("author_id")
    .references(() => users.id)
    .notNull(),
  archived,
});

export const questionAnswerOptions = pgTable("question_answer_options", {
  ...id,
  ...timestamps,
  questionId: uuid("question_id")
    .references(() => questions.id)
    .notNull(),
  optionText: text("option_text").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  position: integer("position"),
});

export const studentQuestionAnswers = pgTable("student_question_answers", {
  ...id,
  ...timestamps,
  questionId: uuid("question_id")
    .references(() => questions.id)
    .notNull(),
  studentId: uuid("student_id")
    .references(() => users.id)
    .notNull(),
  answer: jsonb("answer").default({}),
  isCorrect: boolean("is_correct"),
});

export const lessonQuestions = pgTable("lesson_questions", {
  ...id,
  ...timestamps,
  lessonId: uuid("lesson_id")
    .references(() => lessons.id)
    .notNull(),
  questionId: uuid("question_id")
    .references(() => questions.id)
    .notNull(),
});

export const files = pgTable("files", {
  ...id,
  ...timestamps,
  title: varchar("title", { length: 100 }).notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  state: text("state").notNull().default("draft"),
  authorId: uuid("author_id")
    .references(() => users.id)
    .notNull(),
  archived,
});

export const lessonFiles = pgTable("lesson_files", {
  ...id,
  ...timestamps,
  lessonId: uuid("lesson_id")
    .references(() => lessons.id)
    .notNull(),
  fileId: uuid("file_id")
    .references(() => files.id)
    .notNull(),
});

export const textBlocks = pgTable("text_blocks", {
  ...id,
  ...timestamps,
  title: varchar("title", { length: 100 }).notNull(),
  body: text("body"),
  state: text("state").notNull().default("draft"),
  authorId: uuid("author_id")
    .references(() => users.id)
    .notNull(),
  archived,
});

export const lessonTextBlocks = pgTable("lesson_text_blocks", {
  ...id,
  ...timestamps,
  lessonId: uuid("lesson_id")
    .references(() => lessons.id)
    .notNull(),
  textBlockId: uuid("text_block_id")
    .references(() => textBlocks.id)
    .notNull(),
});

export const lessonItems = pgTable(
  "lesson_items",
  {
    ...id,
    lessonId: uuid("lesson_id")
      .references(() => lessons.id)
      .notNull(),
    lessonItemId: uuid("lesson_item_id").notNull(),
    lessonItemType: text("lesson_item_type").notNull(),
    displayOrder: integer("display_order"),
  },
  (table) => ({
    unq: unique().on(table.lessonId, table.displayOrder),
  }),
);

export const notifications = pgTable("notifications", {
  ...id,
  ...timestamps,
  studentId: uuid("student_id")
    .references(() => users.id)
    .notNull(),
  text: text("text").notNull(),
  readAt: timestamp("read_at", {
    mode: "string",
    withTimezone: true,
    precision: 3,
  }),
});

export const courseLessons = pgTable(
  "course_lessons",
  {
    ...id,
    ...timestamps,
    courseId: uuid("course_id")
      .references(() => courses.id)
      .notNull(),
    lessonId: uuid("lesson_id")
      .references(() => lessons.id)
      .notNull(),
  },
  (table) => ({
    unq: unique().on(table.courseId, table.lessonId),
  }),
);

export const studentCourses = pgTable(
  "student_courses",
  {
    ...id,
    ...timestamps,
    studentId: uuid("student_id")
      .references(() => users.id)
      .notNull(),
    courseId: uuid("course_id")
      .references(() => courses.id)
      .notNull(),
    numberOfAssignments: integer("number_of_assignments"),
    numberOfFinishedAssignments: integer("number_of_finished_assignments"),
    state: text("state").notNull().default("not_started"),
    archived,
  },
  (table) => ({
    unq: unique().on(table.studentId, table.courseId),
  }),
);

export const studentFavouritedCourses = pgTable(
  "student_favourited_courses",
  {
    ...id,
    ...timestamps,
    studentId: uuid("student_id")
      .references(() => users.id)
      .notNull(),
    courseId: uuid("course_id")
      .references(() => courses.id)
      .notNull(),
  },
  (table) => ({
    unq: unique().on(table.studentId, table.courseId),
  }),
);

export const studentCompletedLessonItems = pgTable(
  "student_completed_lesson_items",
  {
    ...id,
    ...timestamps,
    studentId: uuid("student_id")
      .references(() => users.id)
      .notNull(),
    lessonItemId: uuid("lesson_item_id")
      .references(() => lessonItems.id)
      .notNull(),
  },
  (table) => ({
    unq: unique().on(table.studentId, table.lessonItemId),
  }),
);
