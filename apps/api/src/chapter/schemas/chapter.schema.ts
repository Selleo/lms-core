import { type Static, Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";
import { lessonItemSelectSchema } from "src/lesson/lessonItem.schema";

import { ChapterProgress } from "./chapter.types";

export const chapterSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  lessonCount: Type.Number(),
  completedLessonCount: Type.Optional(Type.Number()),
  chapterProgress: Type.Optional(
    Type.Union([
      Type.Literal(ChapterProgress.completed),
      Type.Literal(ChapterProgress.inProgress),
      Type.Literal(ChapterProgress.notStarted),
    ]),
  ),
  isFreemium: Type.Optional(Type.Boolean()),
  enrolled: Type.Optional(Type.Boolean()),
  isPublished: Type.Optional(Type.Boolean()),
  isSubmitted: Type.Optional(Type.Boolean()),
  createdAt: Type.Optional(Type.String()),
  quizScore: Type.Optional(Type.Number()),
});

export const createChapterSchema = Type.Intersect([
  Type.Omit(chapterSchema, ["id", "lessonCount", "completedLessonCount"]),
  Type.Object({
    courseId: UUIDSchema,
  }),
]);

export const updateChapterSchema = Type.Partial(createChapterSchema);

// TODO: update it otr remove if not needed
export const chapter = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  imageUrl: Type.String(),
  description: Type.String(),
  type: Type.String(),
  isFree: Type.Boolean(),
});

export const chapterWithLessonCount = Type.Intersect([
  Type.Omit(chapter, ["type"]),
  Type.Object({
    lessonCount: Type.Number(),
  }),
]);

export const allChapterSchema = Type.Array(chapterSchema);

export const showChapterSchema = Type.Object({
  ...chapterSchema.properties,
  lessonItems: Type.Array(lessonItemSelectSchema),
  chapterProgress: Type.Optional(
    Type.Union([
      Type.Literal(ChapterProgress.completed),
      Type.Literal(ChapterProgress.inProgress),
      Type.Literal(ChapterProgress.notStarted),
    ]),
  ),
});

export type Chapter = Static<typeof chapter>;
export type ChapterWithLessonCount = Static<typeof chapterWithLessonCount>;
export type ChapterResponse = Static<typeof chapterSchema>;
export type ShowChapterResponse = Static<typeof showChapterSchema>;
export type AllChaptersResponse = Static<typeof allChapterSchema>;
export type CreateChapterBody = Static<typeof createChapterSchema>;
export type UpdateChapterBody = Static<typeof updateChapterSchema>;
