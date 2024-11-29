import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useBetaCreateChapter } from "~/api/mutations/admin/useBetaCreateChapter";
import { useUpdateLesson } from "~/api/mutations/admin/useUpdateLesson";
import { queryClient } from "~/api/queryClient";

import { newChapterFormSchema } from "../validators/newChapterFormSchema";

import type { Chapter } from "../../../EditCourse.types";
import type { NewChapterFormValues } from "../validators/newChapterFormSchema";

type UseNewChapterFormProps = {
  courseId?: string;
  chapter?: Chapter;
};

export const useNewChapterForm = ({ courseId, chapter }: UseNewChapterFormProps) => {
  const { mutateAsync: createChapter } = useBetaCreateChapter();
  const { mutateAsync: updateChapter } = useUpdateLesson();
  const form = useForm<NewChapterFormValues>({
    resolver: zodResolver(newChapterFormSchema),
    defaultValues: {
      title: chapter?.title || "",
    },
  });

  const onSubmit = async (data: NewChapterFormValues) => {
    try {
      if (chapter) {
        await updateChapter({ data, lessonId: chapter.id });
        queryClient.invalidateQueries({
          queryKey: ["beta-course", "admin", { id: courseId }],
        });
      } else {
        await createChapter({
          data: { ...data, courseId },
        });
        queryClient.invalidateQueries({
          queryKey: ["beta-course", "admin", { id: courseId }],
        });
      }
    } catch (error) {
      console.error("Error during chapter submission:", error);
    }
  };
  return { form, onSubmit };
};
