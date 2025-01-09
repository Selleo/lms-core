import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../api-client";
import { useTranslation } from "react-i18next";

type UnenrollCourseOptions = {
  id: string;
};

export function useUnenrollCourse() {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (options: UnenrollCourseOptions) => {
      const response = await ApiClient.api.courseControllerUnenrollCourse({
        id: options.id,
      });

      return response.data;
    },
    onSuccess: () => {
      toast({
        variant: "default",
        description: t("enrollCourseView.toast.unenrollCourseSuccessfully"),
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
