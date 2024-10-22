import { Static, Type } from "@sinclair/typebox";
import { UUIDSchema } from "src/common";

export const questionAnswerOptionsSchema = Type.Object({
  id: UUIDSchema,
  optionText: Type.String(),
  position: Type.Union([Type.Number(), Type.Null()]),
  isCorrect: Type.Boolean(),
  questionId: UUIDSchema,
});

export const questionSchema = Type.Object({
  id: UUIDSchema,
  questionType: Type.String(),
  questionBody: Type.String(),
  solutionExplanation: Type.Union([Type.String(), Type.Null()]),
  state: Type.String(),
  authorId: UUIDSchema,
  archived: Type.Boolean(),
});

export const textBlockSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  body: Type.Union([Type.String(), Type.Null()]),
  state: Type.String(),
  authorId: UUIDSchema,
  archived: Type.Boolean(),
});

export const lessonItemFileSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  type: Type.String(),
  url: Type.String(),
  state: Type.String(),
  authorId: UUIDSchema,
  archived: Type.Boolean(),
});

export const lessonItemSchema = Type.Object({
  id: UUIDSchema,
  lessonItemType: Type.String(),
  displayOrder: Type.Union([Type.Number(), Type.Null()]),
});

export const lessonItemWithContent = Type.Object({
  ...lessonItemSchema.properties,
  questionData: Type.Union([questionSchema, Type.Null()]),
  textBlockData: Type.Union([textBlockSchema, Type.Null()]),
  fileData: Type.Union([lessonItemFileSchema, Type.Null()]),
});

export const questionWithContent = Type.Object({
  ...lessonItemSchema.properties,
  questionData: questionSchema,
});

export const questionAnswerOptionsResponse = Type.Object({
  id: UUIDSchema,
  optionText: Type.String(),
  position: Type.Union([Type.Number(), Type.Null()]),
  isStudentAnswer: Type.Union([Type.Boolean(), Type.Null()]),
});

export const questionResponse = Type.Object({
  id: UUIDSchema,
  questionType: Type.String(),
  questionBody: Type.String(),
  questionAnswers: Type.Array(questionAnswerOptionsResponse),
});

export const textBlockResponse = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  body: Type.String(),
  state: Type.String(),
});

export const fileResponse = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  type: Type.String(),
  url: Type.String(),
});

export const lessonItemResponse = Type.Object({
  id: UUIDSchema,
  lessonItemType: Type.String(),
  displayOrder: Type.Union([Type.Number(), Type.Null()]),
  content: Type.Union([questionResponse, textBlockResponse, fileResponse]),
});

export const allLessonItemsResponse = Type.Array(lessonItemResponse);

export type QuestionWithContent = Static<typeof questionWithContent>;
export type LessonItemWithContentSchema = Static<typeof lessonItemWithContent>;
export type LessonItemResponse = Static<typeof lessonItemResponse>;
export type AllLessonItemsResponse = Static<typeof allLessonItemsResponse>;
