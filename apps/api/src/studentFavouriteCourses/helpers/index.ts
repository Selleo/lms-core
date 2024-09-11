import { asc, desc } from "drizzle-orm";
import {
  CourseSortField,
  SortCourseFieldsOptions,
} from "src/courses/schemas/courseQuery";

export const getSortOptions = (sort: SortCourseFieldsOptions) => ({
  sortOrder: sort.startsWith("-") ? desc : asc,
  sortedField: sort.replace(/^-/, "") as CourseSortField,
});
