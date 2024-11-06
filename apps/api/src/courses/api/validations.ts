import { Type } from "@sinclair/typebox";
import { paginatedResponse } from "src/common";
import { allCoursesSchema } from "src/courses/schemas/course.schema";
import { sortCourseFieldsOptions } from "src/courses/schemas/courseQuery";

export const allCoursesValidation = {
  response: paginatedResponse(allCoursesSchema),
  request: [
    { type: "query" as const, name: "title", schema: Type.String() },
    { type: "query" as const, name: "category", schema: Type.String() },
    { type: "query" as const, name: "author", schema: Type.String() },
    {
      type: "query" as const,
      name: "creationDateRange[0]",
      schema: Type.String(),
    },
    {
      type: "query" as const,
      name: "creationDateRange[1]",
      schema: Type.String(),
    },
    {
      type: "query" as const,
      name: "state",
      schema: Type.String(),
    },
    {
      type: "query" as const,
      name: "archived",
      schema: Type.String(),
    },
    {
      type: "query" as const,
      name: "page",
      schema: Type.Number({ minimum: 1 }),
    },
    { type: "query" as const, name: "perPage", schema: Type.Number() },
    { type: "query" as const, name: "sort", schema: sortCourseFieldsOptions },
  ],
};
