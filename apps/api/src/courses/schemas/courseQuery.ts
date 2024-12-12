import { type Static, Type } from "@sinclair/typebox";

import type { UUIDType } from "src/common";
import type { UserRole } from "src/users/schemas/user-roles";

export const courseSortFields = [
  "title",
  "category",
  "creationDate",
  "author",
  "chapterCount",
  "enrolledParticipantsCount",
] as const;

export const CourseSortFields: Record<CourseSortField, CourseSortField> = {
  title: "title",
  category: "category",
  creationDate: "creationDate",
  author: "author",
  chapterCount: "chapterCount",
  enrolledParticipantsCount: "enrolledParticipantsCount",
};

export type CourseSortField = (typeof courseSortFields)[number];

export const sortCourseFieldsOptions = Type.Union([
  Type.Literal("title"),
  Type.Literal("category"),
  Type.Literal("creationDate"),
  Type.Literal("author"),
  Type.Literal("chapterCount"),
  Type.Literal("enrolledParticipantsCount"),
  Type.Literal("-title"),
  Type.Literal("-category"),
  Type.Literal("-creationDate"),
  Type.Literal("-author"),
  Type.Literal("-chapterCount"),
  Type.Literal("-enrolledParticipantsCount"),
]);

export type SortCourseFieldsOptions = Static<typeof sortCourseFieldsOptions>;

export const coursesFilterFiled = Type.Union([
  Type.Literal("title"),
  Type.Literal("category"),
  Type.Literal("creationDateRange"),
  Type.Literal("author"),
]);

export type CoursesFilterFiled = Static<typeof coursesFilterFiled>;

export const coursesFilterSchema = Type.Object({
  title: Type.Optional(Type.String()),
  category: Type.Optional(Type.String()),
  isPublished: Type.Optional(Type.Boolean()),
  creationDateRange: Type.Optional(
    Type.Tuple([Type.String({ format: "date-time" }), Type.String({ format: "date-time" })]),
  ),
  author: Type.Optional(Type.String()),
});

export type CoursesFilterSchema = Static<typeof coursesFilterSchema>;

export type CoursesQuery = {
  filters?: CoursesFilterSchema;
  page?: number;
  perPage?: number;
  sort?: SortCourseFieldsOptions;
  currentUserId?: UUIDType;
  currentUserRole?: UserRole;
};
