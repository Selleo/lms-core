import { Static, Type } from "@sinclair/typebox";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { UUIDSchema } from "src/common";
import { files, questions, textBlocks } from "src/storage/schema";

export const questionAnswerOptionsSchema = Type.Object({
  id: Type.Optional(UUIDSchema),
  optionText: Type.String(),
  position: Type.Union([Type.Number(), Type.Null()]),
  isStudentAnswer: Type.Optional(Type.Boolean()),
  isCorrect: Type.Optional(Type.Boolean()),
  questionId: UUIDSchema,
});

export const questionSchema = Type.Object({
  id: UUIDSchema,
  questionType: Type.String(),
  questionBody: Type.String(),
  state: Type.Optional(Type.String()),
  questionAnswers: Type.Array(questionAnswerOptionsSchema),
  solutionExplanation: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  archived: Type.Optional(Type.Boolean()),
});

export const textBlockSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  body: Type.Union([Type.String(), Type.Null()]),
  state: Type.Optional(Type.String()),
  archived: Type.Optional(Type.Boolean()),
  authorId: UUIDSchema,
});

export const lessonItemFileSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  type: Type.String(),
  url: Type.String(),
  authorId: UUIDSchema,
  state: Type.Optional(Type.String()),
  archived: Type.Optional(Type.Boolean()),
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

export const textBlockUpdateSchema = Type.Partial(
  Type.Omit(textBlockSchema, ["id"]),
);
export const questionUpdateSchema = Type.Partial(
  Type.Omit(questionSchema, ["id"]),
);
export const fileUpdateSchema = Type.Partial(
  Type.Omit(lessonItemFileSchema, ["id"]),
);

export const allLessonItemsSchema = Type.Array(lessonItemSchema);

export type LessonItemResponse = Static<typeof lessonItemSchema>;

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
export type AllLessonItemsResponse = Static<typeof allLessonItemsResponse>;

export const textBlockSelectSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  body: Type.Union([Type.String(), Type.Null()]),
  state: Type.String(),
  authorId: Type.String(),
  archived: Type.Boolean(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export const questionSelectSchema = Type.Object({
  id: UUIDSchema,
  questionType: Type.String(),
  questionBody: Type.String(),
  state: Type.String(),
  authorId: Type.String(),
  archived: Type.Boolean(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  solutionExplanation: Type.Union([Type.String(), Type.Null()]),
});

export const fileSelectSchema = Type.Object({
  id: Type.String(),
  title: Type.String(),
  state: Type.String(),
  authorId: Type.String(),
  type: Type.String(),
  url: Type.String(),
  archived: Type.Boolean(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

export const lessonItemSelectSchema = Type.Union([
  Type.Intersect([
    textBlockSelectSchema,
    Type.Object({ itemType: Type.Literal("text_block") }),
  ]),
  Type.Intersect([
    questionSelectSchema,
    Type.Object({ itemType: Type.Literal("question") }),
  ]),
  Type.Intersect([
    fileSelectSchema,
    Type.Object({ itemType: Type.Literal("file") }),
  ]),
]);

export const allLessonItemsSelectSchema = Type.Array(lessonItemSelectSchema);

export type TextBlockInsertType = InferInsertModel<typeof textBlocks>;
export type QuestionInsertType = InferInsertModel<typeof questions>;
export type FileInsertType = InferInsertModel<typeof files>;

export type TextBlockSelectType = InferSelectModel<typeof textBlocks>;
export type QuestionSelectType = InferSelectModel<typeof questions>;
export type FileSelectType = InferSelectModel<typeof files>;
export type AllLessonItemsSelectType = Array<
  TextBlockSelectType | QuestionSelectType | FileSelectType
>;

export type UpdateTextBlockBody = Static<typeof textBlockUpdateSchema>;
export type UpdateQuestionBody = Static<typeof questionUpdateSchema>;
export type UpdateFileBody = Static<typeof fileUpdateSchema>;

type OmittedFields = "id" | "updatedAt" | "createdAt";

type LessonItemType = Static<typeof lessonItemSelectSchema>;

export type SingleLessonItemResponse = {
  [K in LessonItemType["itemType"]]: Omit<
    Extract<LessonItemType, { itemType: K }>,
    OmittedFields
  >;
}[LessonItemType["itemType"]];
