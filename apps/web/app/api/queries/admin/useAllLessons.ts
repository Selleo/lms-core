import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { ApiClient } from "../../api-client";

import type { GetAllLessonsResponse } from "../../generated-api";

export const lessonSortFields = ["title", "createdAt", "state", "itemsCount"] as const;

export type LessonSortField = (typeof lessonSortFields)[number];
export type LessonSortOption = LessonSortField | `-${LessonSortField}` | "";

type LessonParams = {
  title?: string;
  state?: string;
  archived?: boolean;
  sort?: LessonSortOption;
};

export const ALL_LESSONS_QUERY_KEY = ["lessons", "admin"];

export const allLessonsQueryOptions = (searchParams?: LessonParams) =>
  queryOptions({
    queryKey: [...ALL_LESSONS_QUERY_KEY, searchParams],
    queryFn: async () => {
      const response = await ApiClient.api.lessonsControllerGetAllLessons({
        page: 1,
        perPage: 100,
        ...(searchParams?.title && { title: searchParams.title }),
        ...(searchParams?.state && { state: searchParams.state }),
        ...(searchParams?.archived !== undefined && {
          archived: String(searchParams.archived),
        }),
        ...(searchParams?.sort && { sort: searchParams.sort }),
      });
      return response.data;
    },
    select: (data: GetAllLessonsResponse) => data.data,
  });

export function useAllLessons(searchParams?: LessonParams) {
  return useQuery(allLessonsQueryOptions(searchParams));
}

export function useAllLessonsSuspense(searchParams?: LessonParams) {
  return useSuspenseQuery(allLessonsQueryOptions(searchParams));
}

export const LESSON_SORT_OPTIONS = lessonSortFields.flatMap((field) => [
  {
    value: field,
    label: `${field} A-Z`,
  },
  {
    value: `-${field}` as const,
    label: `${field} Z-A`,
  },
]);
