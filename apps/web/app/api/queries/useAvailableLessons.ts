import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ApiClient } from "../api-client";
import type { GetAvailableLessonsResponse } from "../generated-api";

export const availableLessons = queryOptions({
  queryKey: ["non-course", "lessons"],
  queryFn: async () => {
    const response = await ApiClient.api.lessonsControllerGetAvailableLessons();
    return response.data;
  },
  select: (data: GetAvailableLessonsResponse) => data.data,
});

export function useAvailableLessons() {
  return useQuery(availableLessons);
}

export function useAvailableLessonsSuspense() {
  return useSuspenseQuery(availableLessons);
}
