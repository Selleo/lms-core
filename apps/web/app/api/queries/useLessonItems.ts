import { queryOptions, useQuery } from "@tanstack/react-query";
// TODO Connect to the database when the backend is completed

export const lessonsOptions = queryOptions({
  queryKey: ["lesson-items", "list"],
  queryFn: async () => {
    const response = await fetch("/api/lesson-items");
    return response.json() as Promise<any>;
  },
});

export const useLessonItems = () => {
  return useQuery(lessonsOptions);
};