import { Type, Static } from "@sinclair/typebox";
import { UUIDSchema } from "src/common";

export const lessonsSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  imageUrl: Type.String(),
  description: Type.String(),
});

export const allLessonsSchema = Type.Array(lessonsSchema);

export type LessonsResponse = Static<typeof lessonsSchema>;
export type AllLessonsResponse = Static<typeof allLessonsSchema>;
