import { queryOptions, useQuery } from "@tanstack/react-query";

import type { ApiClientTemporaryReturn } from "./useCurrentLessonItem";
//TODO: Connect to the database when the backend is completed

export const lessonsOptions = queryOptions({
  queryKey: ["lesson-items", "list"],
  queryFn: async () => {
    const response = await fetch("/api/lesson-items");
    return response.json() as Promise<typeof ApiClientTemporaryReturn>;
  },
});

export const useLessonItems = () => {
  return useQuery(lessonsOptions);
};
