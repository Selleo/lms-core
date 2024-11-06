import { createSelectSchema } from "drizzle-typebox";

import { courses } from "src/storage/schema";

import type { Static } from "@sinclair/typebox";

export const commonCourseSchema = createSelectSchema(courses);

export type CommonCourse = Static<typeof commonCourseSchema>;
