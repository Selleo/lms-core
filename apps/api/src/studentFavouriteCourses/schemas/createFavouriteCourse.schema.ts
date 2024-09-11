import { Static, Type } from "@sinclair/typebox";
import { UUIDSchema } from "src/common";

export const createFavouriteCourseSchema = Type.Object({
  courseId: UUIDSchema,
});

export type CreateFavouriteCourseSchema = Static<
  typeof createFavouriteCourseSchema
>;
