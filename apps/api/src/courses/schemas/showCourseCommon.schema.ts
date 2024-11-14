import { type Static, Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";

import { lessonSchema } from "../../lessons/schemas/lesson.schema";

export const commonShowCourseSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  title: Type.String(),
  imageUrl: Type.String(),
  description: Type.String(),
  category: Type.String(),
  categoryId: Type.Optional(Type.String({ format: "uuid" })),
  authorId: Type.Optional(UUIDSchema),
  author: Type.Optional(Type.String()),
  authorEmail: Type.Optional(Type.String()),
  courseLessonCount: Type.Number(),
  completedLessonCount: Type.Optional(Type.Number()),
  enrolled: Type.Optional(Type.Boolean()),
  state: Type.Union([Type.String(), Type.Null()]),
  lessons: Type.Array(lessonSchema),
  priceInCents: Type.Number(),
  currency: Type.String(),
  archived: Type.Optional(Type.Boolean()),
});

export type CommonShowCourse = Static<typeof commonShowCourseSchema>;
