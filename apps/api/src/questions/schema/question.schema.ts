import { Type, Static } from "@sinclair/typebox";
import { UUIDSchema } from "src/common";

export const answerQuestionSchema = Type.Object({
  lessonId: UUIDSchema,
  questionId: UUIDSchema,
  answer: Type.Union([Type.Array(UUIDSchema), Type.String()]),
});
export const questionSchema = Type.Object({
  lessonId: UUIDSchema,
  questionId: UUIDSchema,
  questionType: Type.String(),
});

export type AnswerQuestionSchema = Static<typeof answerQuestionSchema>;
export type QuestionSchema = Static<typeof questionSchema>;
