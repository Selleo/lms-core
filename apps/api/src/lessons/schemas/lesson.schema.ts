import { Type, Static } from "@sinclair/typebox";
import { UUIDSchema } from "src/common";
import { lessonItemSchema } from "./lessonItem.schema";

export const lessonSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  imageUrl: Type.String(),
  description: Type.String(),
  itemsCount: Type.Number(),
  itemsCompletedCount: Type.Optional(Type.Number()),
});

export const allLessonsSchema = Type.Array(lessonSchema);

export const showLessonSchema = Type.Object({
  ...lessonSchema.properties,
  lessonItems: Type.Array(lessonItemSchema),
  itemsCount: Type.Number(),
  itemsCompletedCount: Type.Number(),
});

export type LessonResponse = Static<typeof lessonSchema>;
export type ShowLessonResponse = Static<typeof showLessonSchema>;
export type AllLessonsResponse = Static<typeof allLessonsSchema>;
