import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ApiClient } from "../api-client";
import type { GetNonCourseLessonsResponse } from "../generated-api";

export const nonCourseLessonsQueryOptions = queryOptions({
  queryKey: ["non-course", "lessons"],
  queryFn: async () => {
    const response = await ApiClient.api.coursesControllerGetNonCourseLessons();
    return response.data;
  },
  select: (data: GetNonCourseLessonsResponse) => data.data,
});

export function useNonCourseLessons() {
  return useQuery(nonCourseLessonsQueryOptions);
}

export function useNonCourseSuspense() {
  return useSuspenseQuery(nonCourseLessonsQueryOptions);
}
