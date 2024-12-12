import { type Static, Type } from "@sinclair/typebox";

import { chapterSchema } from "src/chapter/schemas/chapter.schema";
import { UUIDSchema } from "src/common";

export const commonShowCourseSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  title: Type.String(),
  thumbnailUrl: Type.Optional(Type.String()),
  description: Type.String(),
  category: Type.String(),
  categoryId: Type.Optional(Type.String({ format: "uuid" })),
  authorId: Type.Optional(UUIDSchema),
  author: Type.Optional(Type.String()),
  authorEmail: Type.Optional(Type.String()),
  courseChapterCount: Type.Number(),
  completedChapterCount: Type.Optional(Type.Number()),
  enrolled: Type.Optional(Type.Boolean()),
  isPublished: Type.Union([Type.Boolean(), Type.Null()]),
  chapters: Type.Array(chapterSchema),
  priceInCents: Type.Number(),
  currency: Type.String(),
  archived: Type.Optional(Type.Boolean()),
  hasFreeChapter: Type.Optional(Type.Boolean()),
});

export type CommonShowCourse = Static<typeof commonShowCourseSchema>;
