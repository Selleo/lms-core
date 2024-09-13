import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ApiClient } from "../api-client";
import { GetAllCoursesResponse } from "../generated-api";

export const coursesQueryOptions = {
  queryKey: ["courses"],
  queryFn: async () => {
    const response = await ApiClient.api.coursesControllerGetAllCourses();
    return response.data;
  },
  select: (data: GetAllCoursesResponse) => data.data,
};

export function useCourses() {
  return useQuery(coursesQueryOptions);
}

export function useCoursesSuspense() {
  return useSuspenseQuery(coursesQueryOptions);
}
