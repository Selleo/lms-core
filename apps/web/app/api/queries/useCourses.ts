import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ApiClient } from "../api-client";
import { GetAllCoursesResponse } from "../generated-api";
import { SortOption } from "~/types/sorting";

type CourseParams = {
  title?: string;
  category?: string;
  sort?: SortOption;
};

export const coursesQueryOptions = (searchParams?: CourseParams) => ({
  queryKey: ["courses", searchParams],
  queryFn: async () => {
    const response = await ApiClient.api.coursesControllerGetAllCourses({
      page: 1,
      perPage: 100,
      ...(searchParams?.title && { title: searchParams.title }),
      ...(searchParams?.category && { category: searchParams.category }),
      ...(searchParams?.sort && { sort: searchParams.sort }),
    });

    return response.data;
  },
  select: (data: GetAllCoursesResponse) => data.data,
});

export function useCourses(searchParams?: CourseParams) {
  return useQuery(coursesQueryOptions(searchParams));
}

export function useCoursesSuspense(searchParams?: CourseParams) {
  return useSuspenseQuery(coursesQueryOptions(searchParams));
}
