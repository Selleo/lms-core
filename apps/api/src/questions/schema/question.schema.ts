import { type Static, Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";

export const answerQuestionSchema = Type.Object({
  courseId: UUIDSchema,
  lessonId: UUIDSchema,
  questionId: UUIDSchema,
  answer: Type.Union([
    Type.Array(UUIDSchema),
    Type.String(),
    Type.Array(Type.Object({ index: Type.Number(), value: Type.String() })),
  ]),
});

export const questionSchema = Type.Object({
  lessonId: UUIDSchema,
  questionId: UUIDSchema,
  questionType: Type.String(),
});

export type AnswerQuestionSchema = Static<typeof answerQuestionSchema>;
export type QuestionSchema = Static<typeof questionSchema>;
