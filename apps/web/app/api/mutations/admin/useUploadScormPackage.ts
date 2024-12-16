import { useMutation } from "@tanstack/react-query";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

interface UploadScormOptions {
  file: File;
  courseId: string;
  resource?: string;
}

export function useUploadScormPackage() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ file, courseId, resource }: UploadScormOptions) => {
      const formData = new FormData();
      formData.append("file", file);
      resource && formData.append("resource", resource);

      const response = await ApiClient.api.scormControllerUploadScormPackage(
        { courseId },
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
      toast({ description: "SCORM package uploaded successfully" });
    },
    onError: (error) => {
      toast({
        description: error.message,
        variant: "destructive",
      });
    },
  });
}