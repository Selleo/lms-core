import { useMutation } from "@tanstack/react-query";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";
import { useTranslation } from "react-i18next";

interface UploadFileOptions {
  file: File;
  resource?: "lesson" | "lessonItem" | "file" | "course" | "user" | "category";
}

export function useUploadFile() {
  const { toast } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ file, resource }: UploadFileOptions) => {
      const formData = new FormData();
      formData.append("file", file);
      resource && formData.append("resource", resource);

      const response = await ApiClient.api.fileControllerUploadFile(
        { file },
        {
          headers: { "Content-Type": "multipart/form-data" },
          transformRequest: () => {
            return formData;
          },
        },
      );

      return response.data;
    },
    onSuccess: () => {
      toast({ description: t('uploadFile.toast.fileUploadedSuccessfully') });
    },
    onError: (error) => {
      toast({
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
