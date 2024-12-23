import { Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";

import { PhotoQuestionType, QuestionType } from "./lesson.type";

import type { Static } from "@sinclair/typebox";

export const optionSchema = Type.Object({
  id: Type.Optional(UUIDSchema),
  optionText: Type.String(),
  isCorrect: Type.Boolean(),
  position: Type.Number(),
});

export const questionSchema = Type.Object({
  id: Type.Optional(UUIDSchema),
  type: Type.Enum(QuestionType),
  description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  title: Type.String(),
  photoQuestionType: Type.Optional(Type.Union([Type.Enum(PhotoQuestionType), Type.Null()])),
  photoS3Key: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  options: Type.Optional(Type.Array(optionSchema)),
});

export const lessonSchema = Type.Object({
  updatedAt: Type.Optional(Type.String()),
  id: UUIDSchema,
  title: Type.String(),
  type: Type.String(),
  description: Type.String(),
  displayOrder: Type.Number(),
  fileS3Key: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  fileType: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  questions: Type.Optional(Type.Array(questionSchema)),
});

const lessonQuizSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  type: Type.String(),
  displayOrder: Type.Number(),
  description: Type.Optional(Type.String()),
  fileS3Key: Type.Optional(Type.String()),
  fileType: Type.Optional(Type.String()),
  questions: Type.Optional(Type.Array(questionSchema)),
});

export const lessonItemSchema = Type.Object({
  id: UUIDSchema,
  type: Type.String(),
  displayOrder: Type.Number(),
  title: Type.String(),
  description: Type.String(),
  fileS3Key: Type.Optional(Type.String()),
  fileType: Type.Optional(Type.String()),
  questions: Type.Optional(Type.Array(questionSchema)),
});

export const createLessonSchema = Type.Intersect([
  Type.Omit(lessonSchema, ["id", "displayOrder"]),
  Type.Object({
    chapterId: UUIDSchema,
    displayOrder: Type.Optional(Type.Number()),
  }),
]);

export const createQuizLessonSchema = Type.Intersect([
  Type.Omit(lessonQuizSchema, ["id", "displayOrder"]),
  Type.Object({
    chapterId: UUIDSchema,
    displayOrder: Type.Optional(Type.Number()),
  }),
]);

export const lessonShowSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  type: Type.String(),
  description: Type.String(),
  fileType: Type.Union([Type.String(), Type.Null()]),
  fileUrl: Type.Union([Type.String(), Type.Null()]),
  questions: Type.Optional(Type.Array(Type.Any())),
});

export const updateLessonSchema = Type.Partial(createLessonSchema);
export const updateQuizLessonSchema = Type.Partial(createQuizLessonSchema);
export const lessonForChapterSchema = Type.Array(
  Type.Object({
    id: UUIDSchema,
    title: Type.String(),
    type: Type.String(),
    displayOrder: Type.Number(),
    status: Type.String(),
    quizQuestionCount: Type.Union([Type.Number(), Type.Null()]),
  }),
  // Type.Intersect([
  //   Type.Omit(lessonSchema, ["updatedAt", "description", "fileS3Key", "fileType", "questions"]),
  //   Type.Object({
  //     status: Type.String(),
  //     quizQuestionCount: Type.Union([Type.Number(), Type.Null()]),
  //   }),
  // ]),
);

export type LessonForChapterSchema = Static<typeof lessonForChapterSchema>;
export type LessonItemWithContentSchema = Static<typeof lessonItemSchema>;
export type CreateLessonBody = Static<typeof createLessonSchema>;
export type UpdateLessonBody = Static<typeof updateLessonSchema>;
export type UpdateQuizLessonBody = Static<typeof updateQuizLessonSchema>;
export type CreateQuizLessonBody = Static<typeof createQuizLessonSchema>;
// TODO: duplicate
export type QuestionBody = Static<typeof questionSchema>;
export type QuestionSchema = Static<typeof questionSchema>;
export type LessonShow = Static<typeof lessonShowSchema>;
export type LessonSchema = Static<typeof lessonSchema>;
