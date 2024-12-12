import { type Static, Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";

export const courseSchema = Type.Object({
  id: UUIDSchema,
  title: Type.String(),
  thumbnailUrl: Type.Union([Type.String(), Type.Null()]),
  description: Type.String(),
  authorId: Type.Optional(UUIDSchema),
  author: Type.String(),
  authorEmail: Type.Optional(Type.String()),
  category: Type.String(),
  courseChapterCount: Type.Number(),
  completedChapterCount: Type.Number(),
  enrolled: Type.Optional(Type.Boolean()),
  enrolledParticipantCount: Type.Number(),
  priceInCents: Type.Number(),
  currency: Type.String(),
  isPublished: Type.Optional(Type.Boolean()),
  createdAt: Type.Optional(Type.String()),
  hasFreeChapters: Type.Optional(Type.Boolean()),
});

export const allCoursesSchema = Type.Array(courseSchema);
export const allCoursesForTeacherSchema = Type.Array(
  Type.Object({
    ...courseSchema.properties,
    authorId: UUIDSchema,
    authorEmail: Type.String(),
  }),
);

export type AllCoursesResponse = Static<typeof allCoursesSchema>;
export type AllCoursesForTeacherResponse = Static<typeof allCoursesForTeacherSchema>;
