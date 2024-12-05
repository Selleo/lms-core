import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@remix-run/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useCreateBetaTextBlockItem } from "~/api/mutations/admin/useBetaCreateTextBlockItem";
import { useDeleteLesson } from "~/api/mutations/admin/useDeleteLesson";
import { useUpdateTextBlockItem } from "~/api/mutations/admin/useUpdateTextBlockItem";
import { COURSE_QUERY_KEY } from "~/api/queries/admin/useBetaCourse";
import { useCurrentUserSuspense } from "~/api/queries/useCurrentUser";
import { queryClient } from "~/api/queryClient";
import {
  ContentTypes,
  type Chapter,
  type LessonItem,
} from "~/modules/Admin/EditCourse/EditCourse.types";

import { textLessonFormSchema } from "../validators/useTextLessonFormSchema";

import type { TextLessonFormValues } from "../validators/useTextLessonFormSchema";

type TextLessonFormProps = {
  chapterToEdit?: Chapter;
  lessonToEdit?: LessonItem;
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
};

export const useTextLessonForm = ({
  chapterToEdit,
  lessonToEdit,
  setContentTypeToDisplay,
}: TextLessonFormProps) => {
  const { id: courseId } = useParams();
  const { mutateAsync: createTextBlock } = useCreateBetaTextBlockItem();
  const { mutateAsync: updateTextBlockItem } = useUpdateTextBlockItem();
  const { data: currentUser } = useCurrentUserSuspense();
  const { mutateAsync: deleteLesson } = useDeleteLesson();

  const form = useForm<TextLessonFormValues>({
    resolver: zodResolver(textLessonFormSchema),
    defaultValues: {
      title: lessonToEdit?.content.title || "",
      body: lessonToEdit?.content.body || "",
      state: "draft",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (lessonToEdit) {
      reset({
        title: lessonToEdit.content.title,
        body: lessonToEdit?.content.body,
        state: lessonToEdit?.content.state || "draft",
      });
    }
  }, [lessonToEdit, reset]);

  const onSubmit = async (values: TextLessonFormValues) => {
    if (!chapterToEdit) {
      return;
    }
    try {
      if (lessonToEdit) {
        await updateTextBlockItem({ data: { ...values }, textBlockId: lessonToEdit.content?.id });
      } else {
        await createTextBlock({
          data: { ...values, authorId: currentUser.id, lessonId: chapterToEdit.id },
        });
        setContentTypeToDisplay(ContentTypes.EMPTY);
      }

      queryClient.invalidateQueries({ queryKey: [COURSE_QUERY_KEY, { id: courseId }] });
    } catch (error) {
      console.error("Error creating text block:", error);
    }
  };

  const onClickDelete = async () => {
    if (!chapterToEdit?.id || !lessonToEdit?.content.id) {
      console.error("Course ID or Chapter ID is missing.");
      return;
    }

    try {
      await deleteLesson({ chapterId: chapterToEdit?.id, lessonId: lessonToEdit.content.id });
      queryClient.invalidateQueries({
        queryKey: [COURSE_QUERY_KEY, { id: courseId }],
      });
      setContentTypeToDisplay(ContentTypes.EMPTY);
    } catch (error) {
      console.error("Failed to delete chapter:", error);
    }
  };

  return { form, onSubmit, onClickDelete };
};
