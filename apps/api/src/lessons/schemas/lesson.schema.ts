import { type Static, Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";
import { LessonProgress } from "src/lessons/schemas/lesson.types";

import { lessonItemSelectSchema } from "./lessonItem.schema";

export const lessonSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  courseId: Type.Optional(Type.String()),
  imageUrl: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  itemsCount: Type.Number(),
  itemsCompletedCount: Type.Optional(Type.Number()),
  lessonProgress: Type.Optional(
    Type.Union([
      Type.Literal(LessonProgress.completed),
      Type.Literal(LessonProgress.inProgress),
      Type.Literal(LessonProgress.notStarted),
    ]),
  ),
  isFree: Type.Optional(Type.Boolean()),
  enrolled: Type.Optional(Type.Boolean()),
  state: Type.Optional(Type.String()),
  archived: Type.Optional(Type.Boolean()),
  isSubmitted: Type.Optional(Type.Boolean()),
  type: Type.Optional(Type.String()),
  createdAt: Type.Optional(Type.String()),
  quizScore: Type.Optional(Type.Number()),
});

export const createLessonSchema = Type.Omit(lessonSchema, [
  "id",
  "itemsCount",
  "itemsCompletedCount",
]);

export const updateLessonSchema = Type.Partial(createLessonSchema);

export const lesson = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  imageUrl: Type.String(),
  description: Type.String(),
  type: Type.String(),
  isFree: Type.Boolean(),
});

export const lessonWithCountItems = Type.Intersect([
  Type.Omit(lesson, ["type"]),
  Type.Object({
    itemsCount: Type.Number(),
  }),
]);

export const allLessonsSchema = Type.Array(lessonSchema);

export const showLessonSchema = Type.Object({
  ...lessonSchema.properties,
  lessonItems: Type.Array(lessonItemSelectSchema),
  lessonProgress: Type.Optional(
    Type.Union([
      Type.Literal(LessonProgress.completed),
      Type.Literal(LessonProgress.inProgress),
      Type.Literal(LessonProgress.notStarted),
    ]),
  ),
  itemsCount: Type.Number(),
  itemsCompletedCount: Type.Optional(Type.Number()),
});

export type Lesson = Static<typeof lesson>;
export type LessonWithCountItems = Static<typeof lessonWithCountItems>;
export type LessonResponse = Static<typeof lessonSchema>;
export type ShowLessonResponse = Static<typeof showLessonSchema>;
export type AllLessonsResponse = Static<typeof allLessonsSchema>;
export type CreateLessonBody = Static<typeof createLessonSchema>;
export type UpdateLessonBody = Static<typeof updateLessonSchema>;
