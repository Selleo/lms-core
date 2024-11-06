import { type Static, Type } from "@sinclair/typebox";

import { lessonSchema } from "../../lessons/schemas/lesson.schema";

export const commonShowCourseSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  title: Type.String(),
  imageUrl: Type.Union([Type.String(), Type.Null()]),
  description: Type.String(),
  category: Type.String(),
  categoryId: Type.Optional(Type.String({ format: "uuid" })),
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
