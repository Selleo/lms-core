import { type CoursesFilterSchema, type SortCourseFieldsOptions } from "../schemas/courseQuery";

export type CoursesQuery = {
  filters?: CoursesFilterSchema;
  page?: number;
  perPage?: number;
  sort?: SortCourseFieldsOptions;
};
