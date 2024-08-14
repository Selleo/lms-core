import { queryOptions } from "@tanstack/react-query";
//TODO: Connect to the database when the backend is completed

export const useLessonItem = (id: string) =>
  queryOptions({
    queryKey: ["lesson-items", id],
    queryFn: async () => {
      const response = await fetch(`/api/lesson-items/${id}`);
      return response.json() as Promise<any>;
    },
  });
