import { Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";

import type { Static } from "@sinclair/typebox";

export const optionSchema = Type.Object({
  id: Type.Optional(UUIDSchema),
  optionText: Type.String(),
  isCorrect: Type.Boolean(),
  position: Type.Number(),
});

export const questionSchema = Type.Object({
  id: Type.Optional(UUIDSchema),
  type: Type.Enum({
    single_choice: "single_choice",
    multiple_choice: "multiple_choice",
    true_or_false: "true_or_false",
    photo_question: "photo_question",
    fill_in_the_blanks: "fill_in_the_blanks",
    brief_response: "brief_response",
    detailed_response: "detailed_response",
  }),
  description: Type.Optional(Type.String()),
  title: Type.String(),
  photoQuestionType: Type.Optional(
    Type.Enum({
      single_choice: "single_choice",
      multiple_choice: "multiple_choice",
    }),
  ),
  thumbnailS3Key: Type.Optional(Type.String()),
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

export const updateLessonSchema = Type.Partial(createLessonSchema);
export const updateQuizLessonSchema = Type.Partial(createQuizLessonSchema);

export type CreateLessonBody = Static<typeof createLessonSchema>;
export type UpdateLessonBody = Static<typeof updateLessonSchema>;
export type UpdateQuizLessonBody = Static<typeof updateQuizLessonSchema>;
export type CreateQuizLessonBody = Static<typeof createQuizLessonSchema>;
