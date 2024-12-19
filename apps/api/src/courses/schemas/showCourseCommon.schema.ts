import { type Static, Type } from "@sinclair/typebox";

import { chapterSchema } from "src/chapter/schemas/chapter.schema";
import { UUIDSchema } from "src/common";

export const commonShowCourseSchema = Type.Object({
  archived: Type.Optional(Type.Boolean()),
  authorId: Type.Optional(UUIDSchema),
  category: Type.String(),
  categoryId: Type.Optional(Type.String({ format: "uuid" })),
  chapters: Type.Array(chapterSchema),
  completedChapterCount: Type.Optional(Type.Number()),
  courseChapterCount: Type.Number(),
  currency: Type.String(),
  description: Type.String(),
  enrolled: Type.Optional(Type.Boolean()),
  hasFreeChapter: Type.Optional(Type.Boolean()),
  id: Type.String({ format: "uuid" }),
  isPublished: Type.Union([Type.Boolean(), Type.Null()]),
  isScorm: Type.Optional(Type.Boolean()),
  priceInCents: Type.Number(),
  thumbnailUrl: Type.Optional(Type.String()),
  title: Type.String(),
});

export type CommonShowCourse = Static<typeof commonShowCourseSchema>;
