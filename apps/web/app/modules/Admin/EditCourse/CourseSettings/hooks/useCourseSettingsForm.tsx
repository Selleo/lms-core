import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useDeleteFile } from "~/api/mutations/admin/useDeleteFile";
import { useUpdateCourse } from "~/api/mutations/admin/useUpdateCourse";
import { courseQueryOptions } from "~/api/queries/admin/useCourseById";
import { queryClient } from "~/api/queryClient";
import { courseSettingsFormSchema } from "~/modules/Admin/EditCourse/CourseSettings/validators/courseSettingsFormSchema";

import type { UpdateCourseBody } from "~/api/generated-api";
import type { CourseSettingsFormValues } from "~/modules/Admin/EditCourse/CourseSettings/validators/courseSettingsFormSchema";

type CourseSettingsProps = {
  title?: string;
  description?: string;
  categoryId?: string;
  imageUrl?: string;
  courseId: string;
};

export const useCourseSettingsForm = ({
  title,
  description,
  categoryId,
  imageUrl,
  courseId,
}: CourseSettingsProps) => {
  const { mutateAsync: updateCourse } = useUpdateCourse();

  const { mutateAsync: deleteOldFile } = useDeleteFile();
  const form = useForm<CourseSettingsFormValues>({
    resolver: zodResolver(courseSettingsFormSchema),
    defaultValues: {
      title: title || "",
      description: description || "",
      categoryId: categoryId || "",
      imageUrl: imageUrl || "",
    },
  });

  const newImageUrl = form.getValues("imageUrl");
  const oldImageUrl = imageUrl ?? "";

  const oldImageExist = Boolean(oldImageUrl);
  const newImageExist = Boolean(newImageUrl);
  const imageUrlChanged = oldImageExist && newImageExist && newImageUrl !== oldImageUrl;

  const onSubmit = async (data: UpdateCourseBody) => {
    updateCourse({
      data: { ...data },
      courseId,
    }).then(() => {
      queryClient.invalidateQueries(courseQueryOptions(courseId));
      if (imageUrlChanged) {
        deleteOldFile(oldImageUrl);
      }
    });
  };

  return { form, onSubmit };
};
