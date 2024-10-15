import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ApiClient } from "../api-client";
import type { GetAllCoursesResponse } from "../generated-api";
import type { SortOption } from "~/types/sorting";

type CourseParams = {
  title?: string;
  category?: string;
  sort?: SortOption;
  userId?: string;
};

export const availableCoursesQueryOptions = (searchParams?: CourseParams) => ({
  queryKey: ["available-courses", searchParams],
  queryFn: async () => {
    const response = await ApiClient.api.coursesControllerGetAvailableCourses({
      page: 1,
      perPage: 100,
      ...(searchParams?.title && { title: searchParams.title }),
      ...(searchParams?.category && { category: searchParams.category }),
      ...(searchParams?.sort && { sort: searchParams.sort }),
      ...(searchParams?.userId && { userId: searchParams.userId }),
    });
    return response.data;
  },
  select: (data: GetAllCoursesResponse) => data.data,
});

export function useAvailableCourses(searchParams?: CourseParams) {
  return useQuery(availableCoursesQueryOptions(searchParams));
}

export function useAvailableCoursesSuspense(searchParams?: CourseParams) {
  return useSuspenseQuery(availableCoursesQueryOptions(searchParams));
}
