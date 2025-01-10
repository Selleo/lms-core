import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

import type { BetaUpdateLessonBody } from "../../generated-api";
import { useTranslation } from "react-i18next";

type UpdateFileOptions = {
  data: BetaUpdateLessonBody;
  fileLessonId: string;
};

export function useUpdateFileItem() {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (options: UpdateFileOptions) => {
      const response = await ApiClient.api.lessonControllerBetaUpdateLesson(options.data, {
        id: options.fileLessonId,
      });

      return response.data;
    },
    onSuccess: () => {
      toast({
        description: t("adminCourseView.curriculum.lesson.toast.fileLessonUpdatedSuccessfully"),
      });
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
