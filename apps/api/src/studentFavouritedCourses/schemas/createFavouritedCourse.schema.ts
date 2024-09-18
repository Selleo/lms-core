import { Static, Type } from "@sinclair/typebox";
import { UUIDSchema } from "src/common";

export const createFavouritedCourseSchema = Type.Object({
  courseId: UUIDSchema,
});

export type CreateFavouritedCourseSchema = Static<
  typeof createFavouritedCourseSchema
>;
