import { type Static, Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";
import { lessonSchema } from "src/lesson/lesson.schema";
import { PROGRESS_STATUS } from "src/utils/types/progress.type";

export const chapterSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  lessonCount: Type.Number(),
  completedLessonCount: Type.Optional(Type.Number()),
  chapterProgress: Type.Optional(
    Type.Union([
      Type.Literal(PROGRESS_STATUS.completed),
      Type.Literal(PROGRESS_STATUS.inProgress),
      Type.Literal(PROGRESS_STATUS.notStarted),
    ]),
  ),
  isFreemium: Type.Optional(Type.Boolean()),
  enrolled: Type.Optional(Type.Boolean()),
  isPublished: Type.Optional(Type.Boolean()),
  isSubmitted: Type.Optional(Type.Boolean()),
  createdAt: Type.Optional(Type.String()),
  quizCount: Type.Optional(Type.Number()),
  displayOrder: Type.Number(),
});

export const createChapterSchema = Type.Intersect([
  Type.Omit(chapterSchema, ["id", "lessonCount", "completedLessonCount"]),
  Type.Object({
    courseId: UUIDSchema,
  }),
]);

export const updateChapterSchema = Type.Partial(createChapterSchema);

export const chapter = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  isFreemium: Type.Boolean(),
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
  quizCount: Type.Optional(Type.Number()),
  lessons: Type.Array(lessonSchema),
});

export type Chapter = Static<typeof chapter>;
export type ChapterWithLessonCount = Static<typeof chapterWithLessonCount>;
export type ChapterResponse = Static<typeof chapterSchema>;
export type ShowChapterResponse = Static<typeof showChapterSchema>;
export type AllChaptersResponse = Static<typeof allChapterSchema>;
export type CreateChapterBody = Static<typeof createChapterSchema>;
export type UpdateChapterBody = Static<typeof updateChapterSchema>;
