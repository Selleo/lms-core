import { Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";

import { LESSON_TYPES, PhotoQuestionType, QuestionType } from "./lesson.type";

import type { Static } from "@sinclair/typebox";

export const optionSchema = Type.Object({
  id: Type.Optional(UUIDSchema),
  optionText: Type.String(),
  displayOrder: Type.Union([Type.Number(), Type.Null()]),
  isStudentAnswer: Type.Optional(Type.Boolean()),
  isCorrect: Type.Boolean(),
  questionId: Type.Optional(UUIDSchema),
});

export const questionSchema = Type.Object({
  id: Type.Optional(UUIDSchema),
  type: Type.Enum(QuestionType),
  description: Type.Optional(Type.String()),
  title: Type.String(),
  displayOrder: Type.Optional(Type.Number()),
  photoQuestionType: Type.Optional(Type.Enum(PhotoQuestionType)),
  photoS3Key: Type.Optional(Type.String()),
  options: Type.Optional(Type.Array(optionSchema)),
});

export const lessonSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  type: Type.String(),
  description: Type.String(),
  displayOrder: Type.Number(),
  fileS3Key: Type.Optional(Type.String()),
  fileType: Type.Optional(Type.String()),
  questions: Type.Optional(Type.Array(questionSchema)),
  updatedAt: Type.Optional(Type.String()),
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

export const adminLessonSchema = Type.Object({
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

export const questionDetails = Type.Object({
  questions: Type.Array(Type.Any()),
  questionCount: Type.Number(),
  correctAnswerCount: Type.Union([Type.Number(), Type.Null()]),
  wrongAnswerCount: Type.Union([Type.Number(), Type.Null()]),
  score: Type.Union([Type.Number(), Type.Null()]),
});

export const lessonShowSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  type: Type.Enum(LESSON_TYPES),
  description: Type.String(),
  fileType: Type.Union([Type.String(), Type.Null()]),
  fileUrl: Type.Union([Type.String(), Type.Null()]),
  quizDetails: Type.Optional(questionDetails),
  displayOrder: Type.Number(),
});

export const updateLessonSchema = Type.Partial(createLessonSchema);
export const updateQuizLessonSchema = Type.Partial(createQuizLessonSchema);

export type AdminLessonWithContentSchema = Static<typeof adminLessonSchema>;
export type CreateLessonBody = Static<typeof createLessonSchema>;
export type UpdateLessonBody = Static<typeof updateLessonSchema>;
export type UpdateQuizLessonBody = Static<typeof updateQuizLessonSchema>;
export type CreateQuizLessonBody = Static<typeof createQuizLessonSchema>;
// TODO: duplicate
export type OptionBody = Static<typeof optionSchema>;
export type QuestionBody = Static<typeof questionSchema>;
export type QuestionSchema = Static<typeof questionSchema>;
export type LessonShow = Static<typeof lessonShowSchema>;
