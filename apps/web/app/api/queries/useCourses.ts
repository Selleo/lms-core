import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import type { SortOption } from "~/types/sorting";

import { ApiClient } from "../api-client";

import type { GetAllCoursesResponse } from "../generated-api";

type CourseParams = {
  title?: string;
  category?: string;
  state?: string;
  archived?: boolean;
  sort?: SortOption;
  userId?: string;
};

export const ALL_COURSES_QUERY_KEY = ["courses"];

export const allCoursesQueryOptions = (searchParams?: CourseParams) => ({
  queryKey: [...ALL_COURSES_QUERY_KEY, searchParams],
  queryFn: async () => {
    const response = await ApiClient.api.coursesControllerGetAllCourses({
      page: 1,
      perPage: 100,
      ...(searchParams?.title && { title: searchParams.title }),
      ...(searchParams?.category && { category: searchParams.category }),
      ...(searchParams?.state && { state: searchParams.state }),
      ...(searchParams?.archived !== undefined && {
        archived: String(searchParams.archived),
      }),
      ...(searchParams?.sort && { sort: searchParams.sort }),
      ...(searchParams?.userId && { userId: searchParams.userId }),
    });
    return response.data;
  },
  select: (data: GetAllCoursesResponse) => data.data,
});

export function useCourses(searchParams?: CourseParams) {
  return useQuery(allCoursesQueryOptions(searchParams));
}

export function useCoursesSuspense(searchParams?: CourseParams) {
  return useSuspenseQuery(allCoursesQueryOptions(searchParams));
}
