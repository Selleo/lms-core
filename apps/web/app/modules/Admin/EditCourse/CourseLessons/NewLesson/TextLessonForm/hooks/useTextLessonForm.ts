import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@remix-run/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useCreateBetaTextLesson } from "~/api/mutations/admin/useBetaCreateTextLesson";
import { useDeleteLesson } from "~/api/mutations/admin/useDeleteLesson";
import { useUpdateTextLesson } from "~/api/mutations/admin/useUpdateTextLesson";
import { COURSE_QUERY_KEY } from "~/api/queries/admin/useBetaCourse";
import { useCurrentUserSuspense } from "~/api/queries/useCurrentUser";
import { queryClient } from "~/api/queryClient";
import {
  ContentTypes,
  type Chapter,
  type Lesson,
} from "~/modules/Admin/EditCourse/EditCourse.types";

import { textLessonFormSchema } from "../validators/useTextLessonFormSchema";

import type { TextLessonFormValues } from "../validators/useTextLessonFormSchema";

type TextLessonFormProps = {
  chapterToEdit?: Chapter;
  lessonToEdit?: Lesson;
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
};

export const useTextLessonForm = ({
  chapterToEdit,
  lessonToEdit,
  setContentTypeToDisplay,
}: TextLessonFormProps) => {
  const { id: courseId } = useParams();
  const { mutateAsync: createTextBlock } = useCreateBetaTextLesson();
  const { mutateAsync: updateTextBlockItem } = useUpdateTextLesson();
  const { data: currentUser } = useCurrentUserSuspense();
  const { mutateAsync: deleteLesson } = useDeleteLesson();

  const form = useForm<TextLessonFormValues>({
    resolver: zodResolver(textLessonFormSchema),
    defaultValues: {
      title: lessonToEdit?.title || "",
      description: lessonToEdit?.description || "",
      type: lessonToEdit?.type || "text_block",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (lessonToEdit) {
      reset({
        title: lessonToEdit.title,
        description: lessonToEdit?.description,
        type: "text_block",
      });
    }
  }, [lessonToEdit, reset]);

  const onSubmit = async (values: TextLessonFormValues) => {
    if (!chapterToEdit) {
      return;
    }
    try {
      if (lessonToEdit) {
        await updateTextBlockItem({ data: { ...values }, lessonId: lessonToEdit.id });
      } else {
        await createTextBlock({
          data: { ...values, chapterId: chapterToEdit.id },
        });
        setContentTypeToDisplay(ContentTypes.EMPTY);
      }

      queryClient.invalidateQueries({ queryKey: [COURSE_QUERY_KEY, { id: courseId }] });
    } catch (error) {
      console.error("Error creating text block:", error);
    }
  };

  const onClickDelete = async () => {
    if (!chapterToEdit?.id || !lessonToEdit?.id) {
      console.error("Course ID or Chapter ID is missing.");
      return;
    }

    try {
      await deleteLesson({ chapterId: chapterToEdit?.id, lessonId: lessonToEdit.id });
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
