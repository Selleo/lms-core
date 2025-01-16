import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

import type { GetStudentCoursesResponse } from "../generated-api";
import type { SortOption } from "~/types/sorting";

type CourseParams = {
  title?: string;
  category?: string;
  sort?: SortOption;
  userId?: string;
};

export const studentCoursesQueryOptions = (searchParams?: CourseParams) => ({
  queryKey: ["get-student-courses", searchParams],
  queryFn: async () => {
    const response = await ApiClient.api.courseControllerGetStudentCourses({
      page: 1,
      perPage: 100,
      ...(searchParams?.title && { title: searchParams.title }),
      ...(searchParams?.category && { category: searchParams.category }),
      ...(searchParams?.sort && { sort: searchParams.sort }),
      ...(searchParams?.userId && { userId: searchParams.userId }),
    });
    return response.data;
  },
  select: (data: GetStudentCoursesResponse) => data.data,
});

export function useStudentCourses(searchParams?: CourseParams) {
  return useQuery(studentCoursesQueryOptions(searchParams));
}

export function useStudentCoursesSuspense(searchParams?: CourseParams) {
  return useSuspenseQuery(studentCoursesQueryOptions(searchParams));
}
