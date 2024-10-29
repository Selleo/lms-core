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
  solutionExplanation: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  state: Type.Optional(Type.String()),
  questionAnswers: Type.Optional(Type.Array(questionAnswerOptionsSchema)),
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
  lessonItemId: UUIDSchema,
  lessonItemType: Type.String(),
  displayOrder: Type.Union([Type.Number(), Type.Null()]),
});

export const lessonItemWithContent = Type.Object({
  ...lessonItemSchema.properties,
  questionData: Type.Union([questionSchema, Type.Null()]),
  textBlockData: Type.Union([textBlockSchema, Type.Null()]),
  fileData: Type.Union([lessonItemFileSchema, Type.Null()]),
});

export const questionAnswer = Type.Object({
  id: UUIDSchema,
  optionText: Type.String(),
  position: Type.Union([Type.Number(), Type.Null()]),
  isStudentAnswer: Type.Union([Type.Boolean(), Type.Null()]),
  isCorrect: Type.Union([Type.Boolean(), Type.Null()]),
});

export const questionAnswerOptionsResponse = Type.Object({
  id: UUIDSchema,
  optionText: Type.String(),
  position: Type.Union([Type.Number(), Type.Null()]),
  isStudentAnswer: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
  isCorrect: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
  studentAnswerText: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});

export const questionResponse = Type.Object({
  id: UUIDSchema,
  questionType: Type.String(),
  questionBody: Type.String(),
  questionAnswers: Type.Array(questionAnswerOptionsResponse),
  passQuestion: Type.Union([Type.Boolean(), Type.Null()]),
});

export const questionContentResponse = Type.Object({
  id: UUIDSchema,
  questionType: Type.String(),
  questionBody: Type.String(),
  questionAnswers: Type.Array(questionAnswerOptionsResponse),
  passQuestion: Type.Optional(Type.Union([Type.Boolean(), Type.Null()])),
});

export const textBlockContentResponse = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  body: Type.String(),
  state: Type.String(),
});

export const fileContentResponse = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  type: Type.String(),
  url: Type.String(),
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

export const lessonItemResponse = Type.Object({
  lessonItemId: UUIDSchema,
  lessonItemType: Type.String(),
  displayOrder: Type.Union([Type.Number(), Type.Null()]),
  passQuestion: Type.Optional(Type.Union([Type.Null(), Type.Boolean()])),
  content: Type.Union([
    questionContentResponse,
    textBlockContentResponse,
    fileContentResponse,
  ]),
});

export const questionWithContent = Type.Object({
  ...lessonItemSchema.properties,
  questionData: questionSchema,
});

export const allLessonItemsResponse = Type.Array(lessonItemResponse);

export const lessonItemSelectSchema = Type.Object({
  lessonItemId: UUIDSchema,
  lessonItemType: Type.String(),
  displayOrder: Type.Union([Type.Number(), Type.Null()]),
  passQuestion: Type.Optional(Type.Union([Type.Null(), Type.Unknown()])),
  content: Type.Union([
    questionContentResponse,
    textBlockContentResponse,
    fileContentResponse,
  ]),
});

export type LessonItemResponse = Static<typeof lessonItemSelectSchema>;
export type QuestionAnswer = Static<typeof questionAnswer>;
export type QuestionResponse = Static<typeof questionResponse>;
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

export type TextBlockInsertType = InferInsertModel<typeof textBlocks>;
export type QuestionInsertType = InferInsertModel<typeof questions>;
export type FileInsertType = InferInsertModel<typeof files>;

export type TextBlockSelectType = InferSelectModel<typeof textBlocks>;
export type QuestionSelectType = InferSelectModel<typeof questions>;
export type FileSelectType = InferSelectModel<typeof files>;

export type UpdateTextBlockBody = Static<typeof textBlockUpdateSchema>;
export type UpdateQuestionBody = Static<typeof questionUpdateSchema>;
export type UpdateFileBody = Static<typeof fileUpdateSchema>;

export type SingleLessonItemResponse =
  | (TextBlockSelectType & { itemType: "text_block" })
  | (QuestionSelectType & { itemType: "question" })
  | (FileSelectType & { itemType: "file" });

// TEMPORARY FIX
const BaseLessonItem = Type.Object({
  id: Type.String(),
  state: Type.String(),
  archived: Type.Boolean(),
  authorId: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
});

const QuestionItem = Type.Intersect([
  BaseLessonItem,
  Type.Object({
    itemType: Type.Literal("question"),
    questionType: Type.String(),
    questionBody: Type.String(),
    solutionExplanation: Type.Union([Type.String(), Type.Null()]),
  }),
]);

const FileItem = Type.Intersect([
  BaseLessonItem,
  Type.Object({
    itemType: Type.Literal("file"),
    title: Type.String(),
    url: Type.String(),
    type: Type.String(),
  }),
]);

const TextBlockItem = Type.Intersect([
  BaseLessonItem,
  Type.Object({
    itemType: Type.Literal("text_block"),
    title: Type.String(),
    body: Type.Union([Type.String(), Type.Null()]),
  }),
]);

export const GetAllLessonItemsResponseSchema = Type.Array(
  Type.Union([QuestionItem, FileItem, TextBlockItem]),
);

export const GetSingleLessonItemsResponseSchema = Type.Union([
  QuestionItem,
  FileItem,
  TextBlockItem,
]);

export type GetAllLessonItemsResponse = Static<
  typeof GetAllLessonItemsResponseSchema
>;

export type GetSingleLessonItemsResponse = Static<
  typeof GetSingleLessonItemsResponseSchema
>;
