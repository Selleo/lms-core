import { courses } from "src/storage/schema";
import { createSelectSchema } from "drizzle-typebox";
import { Static } from "@sinclair/typebox";

export const commonCourseSchema = createSelectSchema(courses);

export type CommonCourse = Static<typeof commonCourseSchema>;
