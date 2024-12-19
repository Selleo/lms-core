import { Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";

import { PhotoQuestionType, QuestionType } from "./lesson.type";

import type { Static } from "@sinclair/typebox";

export const optionSchema = Type.Object({
  id: Type.Optional(UUIDSchema),
  optionText: Type.String(),
  displayOrder: Type.Union([Type.Number(), Type.Null()]),
  isStudentAnswer: Type.Optional(Type.Boolean()),
  isCorrect: Type.Optional(Type.Boolean()),
  questionId: UUIDSchema,
});

export const questionSchema = Type.Object({
  id: Type.Optional(UUIDSchema),
  type: Type.Enum(QuestionType),
  description: Type.Optional(Type.String()),
  title: Type.String(),
  photoQuestionType: Type.Optional(Type.Enum(PhotoQuestionType)),
  photoS3Key: Type.Optional(Type.String()),
  options: Type.Optional(Type.Array(optionSchema)),
});

export const lessonSchema = Type.Object({
  updatedAt: Type.Optional(Type.String()),
  id: UUIDSchema,
  title: Type.String(),
  type: Type.String(),
  description: Type.String(),
  displayOrder: Type.Number(),
  fileS3Key: Type.Optional(Type.String()),
  fileType: Type.Optional(Type.String()),
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

export const questionAnswer = Type.Object({
  id: UUIDSchema,
  optionText: Type.String(),
  displayOrder: Type.Union([Type.Number(), Type.Null()]),
  isStudentAnswer: Type.Union([Type.Boolean(), Type.Null()]),
  isCorrect: Type.Union([Type.Boolean(), Type.Null()]),
});

export const questionAnswerOptionsResponse = Type.Object({
  id: UUIDSchema,
  optionText: Type.String(),
  displayOrder: Type.Union([Type.Number(), Type.Null()]),
  isStudentAnswer: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
  isCorrect: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
  studentAnswerText: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});
export const createQuizLessonSchema = Type.Intersect([
  Type.Omit(lessonQuizSchema, ["id", "displayOrder"]),
  Type.Object({
    chapterId: UUIDSchema,
    displayOrder: Type.Optional(Type.Number()),
  }),
]);

export const updateLessonSchema = Type.Partial(createLessonSchema);
export const updateQuizLessonSchema = Type.Partial(createQuizLessonSchema);

export type LessonItemWithContentSchema = Static<typeof lessonItemSchema>;
export type CreateLessonBody = Static<typeof createLessonSchema>;
export type UpdateLessonBody = Static<typeof updateLessonSchema>;
export type UpdateQuizLessonBody = Static<typeof updateQuizLessonSchema>;
export type CreateQuizLessonBody = Static<typeof createQuizLessonSchema>;
export type QuestionBody = Static<typeof questionSchema>;
export type QuestionSchema = Static<typeof questionSchema>;
