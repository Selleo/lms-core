import { useQuery } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

import type { GetTutorCoursesResponse } from "../generated-api";

export const tutorCourses = (authorId: string) => {
  return {
    queryKey: ["tutor-courses", authorId],
    queryFn: async () => {
      const response = await ApiClient.api.coursesControllerGetTutorCourses({ authorId });

      return response.data;
    },
    select: (data: GetTutorCoursesResponse) => data.data,
  };
};

export function useTutorCourses(authorId: string) {
  return useQuery(tutorCourses(authorId));
}
