import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ApiClient } from "../api-client";
import type { GetAllLessonsResponse } from "../generated-api";

export const allLessonsQueryOptions = queryOptions({
  queryKey: ["lessons"],
  queryFn: async () => {
    const response = await ApiClient.api.lessonsControllerGetAllLessons();
    return response.data;
  },
  select: (data: GetAllLessonsResponse) => data.data,
});

export function useAllLessons() {
  return useQuery(allLessonsQueryOptions);
}

export function useAllLessonsSuspense() {
  return useSuspenseQuery(allLessonsQueryOptions);
}
