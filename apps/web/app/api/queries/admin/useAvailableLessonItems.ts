import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { ApiClient } from "~/api/api-client";
import { type GetAvailableLessonItemsResponse } from "~/api/generated-api";

export const availableLessonItems = queryOptions({
  queryKey: ["available-lesson-items", "admin"],
  queryFn: async () => {
    const response = await ApiClient.api.lessonsControllerGetAvailableLessonItems();
    return response.data;
  },
  select: (data: GetAvailableLessonItemsResponse) => data.data,
});

export function useAvailableLessonItems() {
  return useQuery(availableLessonItems);
}

export function useAvailableLessonItemsSuspense() {
  return useSuspenseQuery(availableLessonItems);
}
