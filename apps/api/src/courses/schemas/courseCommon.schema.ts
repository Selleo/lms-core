import { type Static } from "@sinclair/typebox";
import { createSelectSchema } from "drizzle-typebox";
import { courses } from "src/storage/schema";

export const commonCourseSchema = createSelectSchema(courses);

export type CommonCourse = Static<typeof commonCourseSchema>;
