import { Type, Static } from "@sinclair/typebox";

export const courseSortFields = [
  "title",
  "category",
  "creationDate",
  "author",
  "lessonsCount",
  "enrolledParticipantsCount",
] as const;

export const CourseSortFields: Record<CourseSortField, CourseSortField> = {
  title: "title",
  category: "category",
  creationDate: "creationDate",
  author: "author",
  lessonsCount: "lessonsCount",
  enrolledParticipantsCount: "enrolledParticipantsCount",
};

export type CourseSortField = (typeof courseSortFields)[number];

export const sortCourseFieldsOptions = Type.Union([
  Type.Literal("title"),
  Type.Literal("category"),
  Type.Literal("creationDate"),
  Type.Literal("author"),
  Type.Literal("lessonsCount"),
  Type.Literal("enrolledParticipantsCount"),
  Type.Literal("-title"),
  Type.Literal("-category"),
  Type.Literal("-creationDate"),
  Type.Literal("-author"),
  Type.Literal("-lessonsCount"),
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
  state: Type.Optional(Type.String()),
  archived: Type.Optional(Type.String()),
  creationDateRange: Type.Optional(
    Type.Tuple([
      Type.String({ format: "date-time" }),
      Type.String({ format: "date-time" }),
    ]),
  ),
  author: Type.Optional(Type.String()),
});

export type CoursesFilterSchema = Static<typeof coursesFilterSchema>;
