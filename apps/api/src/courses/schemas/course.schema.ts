import { type Static, Type } from "@sinclair/typebox";

import { UUIDSchema } from "src/common";

export const allCoursesSchema = Type.Array(
  Type.Object({
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
  }),
);

export type AllCoursesResponse = Static<typeof allCoursesSchema>;
