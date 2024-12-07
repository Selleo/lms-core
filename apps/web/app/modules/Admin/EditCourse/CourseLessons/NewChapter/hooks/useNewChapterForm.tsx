import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useBetaCreateChapter } from "~/api/mutations/admin/useBetaCreateChapter";
import { useDeleteChapter } from "~/api/mutations/admin/useDeleteChapter";
import { useUpdateLesson } from "~/api/mutations/admin/useUpdateLesson";
import { COURSE_QUERY_KEY } from "~/api/queries/admin/useBetaCourse";
import { queryClient } from "~/api/queryClient";

import { ContentTypes, type Chapter } from "../../../EditCourse.types";
import { newChapterFormSchema } from "../validators/newChapterFormSchema";

import type { NewChapterFormValues } from "../validators/newChapterFormSchema";

type UseNewChapterFormProps = {
  courseId?: string;
  chapter?: Chapter;
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
};

export const useNewChapterForm = ({
  courseId,
  chapter,
  setContentTypeToDisplay,
}: UseNewChapterFormProps) => {
  const { mutateAsync: createChapter } = useBetaCreateChapter();
  const { mutateAsync: updateChapter } = useUpdateLesson();
  const { mutateAsync: deleteChapter } = useDeleteChapter();

  const form = useForm<NewChapterFormValues>({
    resolver: zodResolver(newChapterFormSchema),
    defaultValues: {
      title: chapter?.title || "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    reset({
      title: chapter?.title || "",
    });
  }, [chapter, reset]);

  const onSubmit = async (data: NewChapterFormValues) => {
    try {
      if (chapter) {
        await updateChapter({ data, lessonId: chapter.id });
        queryClient.invalidateQueries({
          queryKey: [COURSE_QUERY_KEY, { id: courseId }],
        });
      } else {
        await createChapter({
          data: { ...data, courseId },
        });
        queryClient.invalidateQueries({
          queryKey: [COURSE_QUERY_KEY, { id: courseId }],
        });
      }
    } catch (error) {
      console.error("Error during chapter submission:", error);
    }
  };

  const onClickDelete = async () => {
    if (!courseId || !chapter?.id) {
      console.error("Course ID or Chapter ID is missing.");
      return;
    }

    try {
      await deleteChapter({ courseId, chapterId: chapter.id });
      setContentTypeToDisplay(ContentTypes.EMPTY);
      queryClient.invalidateQueries({
        queryKey: [COURSE_QUERY_KEY, { id: courseId }],
      });
    } catch (error) {
      console.error("Failed to delete chapter:", error);
    }
  };
  return { form, onSubmit, onClickDelete };
};
