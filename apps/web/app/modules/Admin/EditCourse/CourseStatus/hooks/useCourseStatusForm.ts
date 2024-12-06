import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useUpdateCourse } from "~/api/mutations/admin/useUpdateCourse";
import { COURSE_QUERY_KEY } from "~/api/queries/admin/useBetaCourse";
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
      queryClient.invalidateQueries({ queryKey: [COURSE_QUERY_KEY, { id: courseId }] });
    });
  };

  return { form, onSubmit };
};
