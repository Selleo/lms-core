import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

import type { GetAllCoursesResponse } from "../generated-api";
import type { SortOption } from "~/types/sorting";

type CourseParams = {
  title?: string;
  category?: string;
  isPublished?: boolean;
  sort?: SortOption;
  authorId?: string;
};

type QueryOptions = {
  enabled?: boolean;
};

export const ALL_COURSES_QUERY_KEY = ["courses"];

export const allCoursesQueryOptions = (
  searchParams?: CourseParams,
  options: QueryOptions = { enabled: true },
) => ({
  queryKey: [...ALL_COURSES_QUERY_KEY, searchParams],
  queryFn: async () => {
    const response = await ApiClient.api.courseControllerGetAllCourses({
      ...(searchParams?.title && { title: searchParams.title }),
      ...(searchParams?.category && { category: searchParams.category }),
      ...(searchParams?.authorId && { authorId: searchParams.authorId }),
      ...(searchParams?.isPublished !== undefined && {
        isPublished: String(searchParams.isPublished),
      }),
      ...(searchParams?.sort && { sort: searchParams.sort }),
      page: 1,
      perPage: 100,
    });
    return response.data;
  },
  select: (data: GetAllCoursesResponse) => data.data,
  ...options,
});

export function useCourses(searchParams?: CourseParams, options?: QueryOptions) {
  return useQuery(allCoursesQueryOptions(searchParams, options));
}

export function useCoursesSuspense(searchParams?: CourseParams, options?: QueryOptions) {
  return useSuspenseQuery(allCoursesQueryOptions(searchParams, options));
}
