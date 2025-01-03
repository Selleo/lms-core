import { Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";
import { PROGRESS_STATUSES } from "src/utils/types/progress.type";

import { LESSON_TYPES, PhotoQuestionType, QuestionType } from "./lesson.type";

import type { Static } from "@sinclair/typebox";

export const optionSchema = Type.Object({
  id: Type.Optional(UUIDSchema),
  optionText: Type.String(),
  displayOrder: Type.Union([Type.Number(), Type.Null()]),
  isStudentAnswer: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
  isCorrect: Type.Boolean(),
  questionId: Type.Optional(UUIDSchema),
  matchedWord: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  scaleAnswer: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
});

export const questionSchema = Type.Object({
  id: Type.Optional(UUIDSchema),
  type: Type.Enum(QuestionType),
  description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  title: Type.String(),
  displayOrder: Type.Optional(Type.Number()),
  photoQuestionType: Type.Optional(Type.Union([Type.Enum(PhotoQuestionType), Type.Null()])),
  photoS3Key: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  options: Type.Optional(Type.Array(optionSchema)),
});

export const lessonSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  type: Type.String(),
  description: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  displayOrder: Type.Number(),
  fileS3Key: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  fileType: Type.Optional(Type.Union([Type.String(), Type.Null()])),
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
  questions: Type.Array(questionSchema),
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
  isExternal: Type.Optional(Type.Boolean()),
});

export const updateLessonSchema = Type.Partial(createLessonSchema);
export const updateQuizLessonSchema = Type.Partial(createQuizLessonSchema);
export const lessonForChapterSchema = Type.Array(
  Type.Object({
    id: UUIDSchema,
    title: Type.String(),
    type: Type.Union([
      Type.Literal(LESSON_TYPES.QUIZ),
      Type.Literal(LESSON_TYPES.PRESENTATION),
      Type.Literal(LESSON_TYPES.VIDEO),
      Type.Literal(LESSON_TYPES.TEXT),
    ]),
    displayOrder: Type.Number(),
    status: Type.Union([
      Type.Literal(PROGRESS_STATUSES.COMPLETED),
      Type.Literal(PROGRESS_STATUSES.IN_PROGRESS),
      Type.Literal(PROGRESS_STATUSES.NOT_STARTED),
    ]),
    quizQuestionCount: Type.Union([Type.Number(), Type.Null()]),
    isExternal: Type.Optional(Type.Boolean()),
  }),
);

export const answerQuestionsForLessonBody = Type.Object({
  lessonId: UUIDSchema,
  answers: Type.Array(
    Type.Object({
      questionId: UUIDSchema,
      answer: Type.Array(
        Type.Object({ answerId: UUIDSchema, value: Type.Optional(Type.String()) }),
      ),
    }),
  ),
});

export type AdminLessonWithContentSchema = Static<typeof adminLessonSchema>;
export type LessonForChapterSchema = Static<typeof lessonForChapterSchema>;
export type CreateLessonBody = Static<typeof createLessonSchema>;
export type UpdateLessonBody = Static<typeof updateLessonSchema>;
export type UpdateQuizLessonBody = Static<typeof updateQuizLessonSchema>;
export type CreateQuizLessonBody = Static<typeof createQuizLessonSchema>;
// TODO: duplicate
export type OptionBody = Static<typeof optionSchema>;
export type QuestionBody = Static<typeof questionSchema>;
export type QuestionSchema = Static<typeof questionSchema>;
export type LessonShow = Static<typeof lessonShowSchema>;
export type LessonSchema = Static<typeof lessonSchema>;
export type AnswerQuestionBody = Static<typeof answerQuestionsForLessonBody>;
export type QuestionDetails = Static<typeof questionDetails>;
