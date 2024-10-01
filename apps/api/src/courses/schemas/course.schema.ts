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
    enrolled: Type.Boolean(),
    enrolledParticipantCount: Type.Number(),
  }),
);

export type AllCoursesResponse = Static<typeof allCoursesSchema>;
