import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "@remix-run/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useBetaCreateFileItem } from "~/api/mutations/admin/useBetaCreateFile";
import { useDeleteLesson } from "~/api/mutations/admin/useDeleteLesson";
import { useUpdateFileItem } from "~/api/mutations/admin/useUpdateFileItem";
import { COURSE_QUERY_KEY } from "~/api/queries/admin/useBetaCourse";
import { useCurrentUserSuspense } from "~/api/queries/useCurrentUser";
import { queryClient } from "~/api/queryClient";
import { ContentTypes } from "~/modules/Admin/EditCourse/EditCourse.types";

import { fileLessonFormSchema } from "../validators/fileLessonFormSchema";

import type { LessonTypes } from "../../../CourseLessons.types";
import type { FileLessonFormValues } from "../validators/fileLessonFormSchema";
import type { Chapter, LessonItem } from "~/modules/Admin/EditCourse/EditCourse.types";

type FileLessonFormProps = {
  chapterToEdit?: Chapter;
  lessonToEdit?: LessonItem;
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
};

export const useFileLessonForm = ({
  chapterToEdit,
  lessonToEdit,
  setContentTypeToDisplay,
}: FileLessonFormProps) => {
  const { id: courseId } = useParams();
  const { data: currentUser } = useCurrentUserSuspense();
  const { mutateAsync: createFile } = useBetaCreateFileItem();
  const { mutateAsync: updateFileItem } = useUpdateFileItem();
  const { mutateAsync: deleteLesson } = useDeleteLesson();

  const form = useForm<FileLessonFormValues>({
    resolver: zodResolver(fileLessonFormSchema),
    defaultValues: {
      title: lessonToEdit?.content.title || "",
      state: lessonToEdit?.content.state || "draft",
      body: lessonToEdit?.content.body || "",
      type: (lessonToEdit?.content.type as LessonTypes) || "video",
      url: lessonToEdit?.content.url || "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (lessonToEdit) {
      reset({
        title: lessonToEdit.content.title,
        body: lessonToEdit?.content.body,
        type: (lessonToEdit.content.type as LessonTypes) || "video",
        url: lessonToEdit.content.url,
        state: lessonToEdit?.content.state || "draft",
      });
    }
  }, [lessonToEdit, reset]);

  const onSubmit = async (values: FileLessonFormValues) => {
    if (!chapterToEdit) {
      return;
    }

    try {
      if (lessonToEdit) {
        updateFileItem({ data: { ...values }, fileId: lessonToEdit.content.id });
        setContentTypeToDisplay(ContentTypes.EMPTY);
      } else {
        await createFile({
          data: { ...values, authorId: currentUser.id, lessonId: chapterToEdit.id },
        });
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
