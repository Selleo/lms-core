import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

import type { BetaUpdateQuizLessonBody } from "~/api/generated-api";

type UpdateLessonOptions = {
  data: BetaUpdateQuizLessonBody;
  lessonId: string;
};

export function useUpdateQuizLesson() {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (options: UpdateLessonOptions) => {
      const response = await ApiClient.api.lessonControllerBetaUpdateQuizLesson(options.data, {
        id: options.lessonId,
      });

      return response.data;
    },
    onSuccess: () => {
      toast({
        variant: "default",
        title: t("adminCourseView.curriculum.lesson.toast.lessonUpdatedSuccessfully"),
        description: t("adminCourseView.curriculum.lesson.toast.lessonUpdatedSuccessfully"),
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast({
          variant: "destructive",
          description: error.response?.data.message,
        });
      }
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });
}
