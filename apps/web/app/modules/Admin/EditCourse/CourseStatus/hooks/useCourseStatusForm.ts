import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useUpdateCourse } from "~/api/mutations/admin/useUpdateCourse";
import { courseQueryOptions } from "~/api/queries/admin/useCourseById";
import { queryClient } from "~/api/queryClient";

import { courseStatusFormSchema } from "../validators/courseStatusFormSchema";

import type { CourseStatusFormValues } from "../validators/courseStatusFormSchema";
import type { UpdateCourseBody } from "~/api/generated-api";

type UseCourseStatusFormProps = {
  courseId: string;
  state?: string;
};

export const useCourseStatusForm = ({ courseId, state }: UseCourseStatusFormProps) => {
  const { mutateAsync: updateCourse } = useUpdateCourse();
  const form = useForm<CourseStatusFormValues>({
    resolver: zodResolver(courseStatusFormSchema),
    defaultValues: {
      state: (state || "draft") as "draft" | "published",
    },
  });
  const onSubmit = async (data: UpdateCourseBody) => {
    updateCourse({
      data: { ...data },
      courseId,
    }).then(() => {
      queryClient.invalidateQueries(courseQueryOptions(courseId));
    });
  };

  return { form, onSubmit };
};
