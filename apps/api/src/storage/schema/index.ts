import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { UserRoles } from "src/users/schemas/user-roles";
import { archived, id, Status, timestamps } from "./utils";

export const users = pgTable("users", {
  ...id,
  ...timestamps,
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default(UserRoles.student),
  archived: boolean("archived").notNull().default(false),
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

// export const lessons = pgTable("lessons", {
//   ...id,
//   ...timestamps,
//   title: text("title").notNull(),
//   description: text("description"),
//   image_url: text("image_url"),
//   author_id: uuid("author_id")
//     .references(() => users.id)
//     .notNull(),
//   status: text("status").notNull().default(Status.draft),
//   archived,
// });

// export const conversations = pgTable("conversations", {
//   ...id,
//   ...timestamps,
//   participant1_id: uuid("participant1_id")
//     .references(() => users.id)
//     .notNull(),
//   participant2_id: uuid("participant2_id")
//     .references(() => users.id)
//     .notNull(),
// });

// export const conversationMessages = pgTable("conversation_messages", {
//   ...id,
//   ...timestamps,
//   message: text("message").notNull(),
//   conversation_id: uuid("conversation_id")
//     .references(() => conversations.id)
//     .notNull(),
//   author_id: uuid("author_id")
//     .references(() => users.id)
//     .notNull(),
//   read_at: timestamp("read_at", {
//     mode: "string",
//     withTimezone: true,
//     precision: 3,
//   }),
// });

// export const questions = pgTable("questions", {
//   ...id,
//   ...timestamps,
//   question_type: text("question_type").notNull(),
//   question_text: text("question_text").notNull(),
//   answer_explanation: text("answer_explanation").notNull(),
//   status: text("status").notNull().default(Status.draft),
//   author_id: uuid("author_id")
//     .references(() => users.id)
//     .notNull(),
// });

// export const questionAnswerOptions = pgTable("question_answer_options", {
//   ...id,
//   ...timestamps,
//   question_id: uuid("question_id")
//     .references(() => questions.id)
//     .notNull(),
//   option_text: text("option_text").notNull(),
//   is_correct: boolean("is_correct").notNull(),
//   position: integer("position"),
// });

// export const studentQuestionAnswers = pgTable("student_question_answers", {
//   ...id,
//   ...timestamps,
//   question_id: uuid("question_id")
//     .references(() => questions.id)
//     .notNull(),
//   student_id: uuid("student_id")
//     .references(() => users.id)
//     .notNull(),
//   answer: jsonb("answer").default({}),
//   is_correct: boolean("is_correct"),
// });

// export const lessonQuestions = pgTable("lesson_questions", {
//   ...id,
//   ...timestamps,
//   lesson_id: uuid("lesson_id")
//     .references(() => lessons.id)
//     .notNull(),
//   question_id: uuid("question_id")
//     .references(() => questions.id)
//     .notNull(),
// });

// export const files = pgTable("files", {
//   ...id,
//   ...timestamps,
//   type: text("type").notNull(),
//   url: text("url").notNull(),
//   status: text("status").notNull().default(Status.draft),
//   author_id: uuid("author_id")
//     .references(() => users.id)
//     .notNull(),
// });

// export const lessonFiles = pgTable("lesson_files", {
//   ...id,
//   ...timestamps,
//   lesson_id: uuid("lesson_id")
//     .references(() => lessons.id)
//     .notNull(),
//   file_id: uuid("file_id")
//     .references(() => files.id)
//     .notNull(),
// });

// export const textBlocks = pgTable("text_blocks", {
//   ...id,
//   ...timestamps,
//   body: text("body"),
//   status: text("status").notNull().default(Status.draft),
//   author_id: uuid("author_id")
//     .references(() => users.id)
//     .notNull(),
// });

// export const lessonTextBlocks = pgTable("lesson_text_blocks", {
//   ...id,
//   ...timestamps,
//   lesson_id: uuid("lesson_id")
//     .references(() => lessons.id)
//     .notNull(),
//   text_block_id: uuid("text_block_id")
//     .references(() => textBlocks.id)
//     .notNull(),
// });

// export const lessonItemsOrder = pgTable("lesson_items_order", {
//   ...id,
//   lesson_id: uuid("lesson_id")
//     .references(() => lessons.id)
//     .notNull(),
//   item_id: uuid("item_id").notNull(),
//   item_type: text("item_type").notNull(),
//   order: integer("order"),
// });

// export const notifications = pgTable("notifications", {
//   ...id,
//   ...timestamps,
//   student_id: uuid("student_id")
//     .references(() => users.id)
//     .notNull(),
//   text: text("text").notNull(),
//   read_at: timestamp("read_at", {
//     mode: "string",
//     withTimezone: true,
//     precision: 3,
//   }),
// });
