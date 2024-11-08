import { type Static, Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";

export const courseSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  imageUrl: Type.Union([Type.String(), Type.Null()]),
  description: Type.String(),
  author: Type.String(),
  category: Type.String(),
  courseLessonCount: Type.Number(),
  completedLessonCount: Type.Number(),
  enrolled: Type.Optional(Type.Boolean()),
  enrolledParticipantCount: Type.Number(),
  priceInCents: Type.Number(),
  currency: Type.String(),
  state: Type.Optional(Type.String()),
  archived: Type.Optional(Type.Boolean()),
  createdAt: Type.Optional(Type.String()),
});

export const allCoursesSchema = Type.Array(courseSchema);
export const allCoursesForTutorSchema = Type.Array(
  Type.Object({
    ...courseSchema.properties,
    authorId: UUIDSchema,
    authorEmail: Type.String(),
  }),
);

export type AllCoursesResponse = Static<typeof allCoursesSchema>;
export type AllCoursesForTutorResponse = Static<typeof allCoursesForTutorSchema>;
