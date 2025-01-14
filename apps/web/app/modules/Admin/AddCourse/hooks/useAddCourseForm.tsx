import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@remix-run/react";
import { useForm } from "react-hook-form";

import { useCreateCourse } from "~/api/mutations/useCreateCourse";
import { ALL_COURSES_QUERY_KEY } from "~/api/queries/useCourses";
import { queryClient } from "~/api/queryClient";
import { addCourseFormSchema } from "~/modules/Admin/AddCourse/validators/addCourseFormSchema";

import type { AddCourseFormValues } from "~/modules/Admin/AddCourse/validators/addCourseFormSchema";

export const useAddCourseForm = () => {
  const navigate = useNavigate();
  const { mutateAsync: createCourse } = useCreateCourse();
  const form = useForm<AddCourseFormValues>({
    resolver: zodResolver(addCourseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      thumbnailS3Key: "",
      thumbnailUrl: "",
    },
  });

  const onSubmit = (values: AddCourseFormValues) => {
    const { thumbnailUrl: _, ...rest } = values;
    createCourse({
      data: { ...rest },
    }).then(({ data }) => {
      queryClient.invalidateQueries({ queryKey: ALL_COURSES_QUERY_KEY });
      navigate(`/admin/beta-courses/${data.id}`);
    });
  };

  return { form, onSubmit };
};
