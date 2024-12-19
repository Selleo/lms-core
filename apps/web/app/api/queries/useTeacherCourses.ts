import { useQuery } from "@tanstack/react-query";

import { ApiClient } from "../api-client";

import type { GetTeacherCoursesResponse } from "../generated-api";

type SearchParams = {
  scope?: "all" | "enrolled" | "available";
  excludeCourseId?: string;
};

export const teacherCoursesOptions = (authorId?: string, searchParams?: SearchParams) => {
  return {
    enabled: !!authorId,
    queryKey: ["teacher-courses", authorId],
    queryFn: async () => {
      if (!authorId) {
        throw new Error("Author ID is required");
      }

      const response = await ApiClient.api.courseControllerGetTeacherCourses({
        authorId,
        ...(searchParams?.scope && { scope: searchParams.scope }),
        ...(searchParams?.excludeCourseId && { excludeCourseId: searchParams.excludeCourseId }),
      });

      return response.data;
    },
    select: (data: GetTeacherCoursesResponse) => data.data,
  };
};

export function useTeacherCourses(authorId?: string, searchParams?: SearchParams) {
  return useQuery(teacherCoursesOptions(authorId, searchParams));
}
