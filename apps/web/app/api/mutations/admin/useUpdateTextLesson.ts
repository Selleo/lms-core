import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

import type { BetaUpdateLessonBody } from "../../generated-api";
import { useTranslation } from "react-i18next";

type UpdateTextLessonOptions = {
  data: BetaUpdateLessonBody;
  lessonId: string;
};

export function useUpdateTextLesson() {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (options: UpdateTextLessonOptions) => {
      const response = await ApiClient.api.lessonControllerBetaUpdateLesson(options.data, {
        id: options.lessonId,
      });

      return response.data;
    },
    onSuccess: () => {
      toast({ description: t("adminCourseView.curriculum.lesson.toast.textItemUpdatedSuccessfully")});
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast({
          description: error.response?.data.message,
          variant: "destructive",
        });
      }
      toast({
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
