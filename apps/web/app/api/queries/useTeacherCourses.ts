import { useQuery } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

import type { GetTeacherCoursesResponse } from "../generated-api";

export const teacherCourses = (authorId: string) => {
  return {
    queryKey: ["teacher-courses", authorId],
    queryFn: async () => {
      const response = await ApiClient.api.coursesControllerGetTeacherCourses({ authorId });

      return response.data;
    },
    select: (data: GetTeacherCoursesResponse) => data.data,
  };
};

export function useTeacherCourses(authorId: string) {
  return useQuery(teacherCourses(authorId));
}
