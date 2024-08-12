import { queryOptions, useQuery } from "@tanstack/react-query";

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
