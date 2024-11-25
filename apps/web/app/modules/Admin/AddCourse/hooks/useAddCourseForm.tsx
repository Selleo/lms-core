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
      state: "draft",
      categoryId: "",
      imageUrl: "",
    },
  });

  const onSubmit = (values: AddCourseFormValues) => {
    createCourse({
      data: { ...values },
    }).then(({ data }) => {
      queryClient.invalidateQueries({ queryKey: ALL_COURSES_QUERY_KEY });
      navigate(`/admin/courses/${data.id}`);
    });
  };

  return { form, onSubmit };
};
