import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@remix-run/react";
import { useForm } from "react-hook-form";

import { useCreateBetaTextBlockItem } from "~/api/mutations/admin/useBetaCreateTextBlockItem";
import { useCurrentUserSuspense } from "~/api/queries/useCurrentUser";
import { queryClient } from "~/api/queryClient";

import { newTextLessonFormSchema } from "../validators/newTextLessonFormSchema";

import type { NewTextLessonFormValues } from "../validators/newTextLessonFormSchema";
import type { Chapter } from "~/modules/Admin/EditCourse/EditCourse.types";

export const useNewTextLessonForm = ({ chapterToEdit }: { chapterToEdit?: Chapter }) => {
  const { id: courseId } = useParams();
  const { mutateAsync: createTextBlock } = useCreateBetaTextBlockItem();
  const { data: currentUser } = useCurrentUserSuspense();
  const form = useForm<NewTextLessonFormValues>({
    resolver: zodResolver(newTextLessonFormSchema),
    defaultValues: {
      title: "",
      body: "",
      state: "draft",
    },
  });

  const onSubmit = async (values: NewTextLessonFormValues) => {
    if (!chapterToEdit) {
      return;
    }

    try {
      await createTextBlock({
        data: { ...values, authorId: currentUser.id, lessonId: chapterToEdit.id },
      });

      queryClient.invalidateQueries({ queryKey: ["beta-course", "admin", { id: courseId }] });
    } catch (error) {
      console.error("Error creating text block:", error);
    }
  };

  return { form, onSubmit };
};
