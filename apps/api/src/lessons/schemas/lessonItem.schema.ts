import { Type, Static } from "@sinclair/typebox";
import { UUIDSchema } from "src/common";

export const questionAnswerOptionsSchema = Type.Object({
  id: UUIDSchema,
  optionText: Type.String(),
  position: Type.Union([Type.Number(), Type.Null()]),
  isStudentAnswer: Type.Boolean(),
});

export const questionSchema = Type.Object({
  id: UUIDSchema,
  questionType: Type.String(),
  questionBody: Type.String(),
  questionAnswers: Type.Array(questionAnswerOptionsSchema),
});

export const textBlockSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  body: Type.String(),
  state: Type.String(),
});

export const lessonItemFileSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  type: Type.String(),
  url: Type.String(),
});

export const lessonItemSchema = Type.Object({
  lessonItemType: Type.String(),
  displayOrder: Type.Union([Type.Number(), Type.Null()]),
  content: Type.Union([questionSchema, textBlockSchema, lessonItemFileSchema]),
});

export const allLessonItemsSchema = Type.Array(lessonItemSchema);

export type LessonItemResponse = Static<typeof lessonItemSchema>;
export type AllLessonItemsResponse = Static<typeof allLessonItemsSchema>;
