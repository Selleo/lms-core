import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";
import { BetaCreateLessonBody } from "~/api/generated-api";
import { useTranslation } from "react-i18next";

type CreateTextBlockOptions = {
  data: BetaCreateLessonBody;
};

export function useCreateTextLesson() {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (options: CreateTextBlockOptions) => {
      const response = await ApiClient.api.lessonControllerBetaCreateLesson(options.data);

      return response.data;
    },
    onSuccess: () => {
      toast({
        variant: "default",
        description: t("adminCourseView.curriculum.lesson.toast.textItemCreatedSuccessfully"),
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
