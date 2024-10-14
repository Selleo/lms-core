import { useMutation } from "@tanstack/react-query";
import { useToast } from "~/components/ui/use-toast";
import { ApiClient } from "../../api-client";

interface UploadFileOptions {
  file: File;
}

export function useUploadFile() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ file }: UploadFileOptions) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await ApiClient.api.s3ControllerUploadFile(
        { file },
        {
          headers: { "Content-Type": "multipart/form-data" },
          transformRequest: () => {
            return formData;
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      toast({ description: "File uploaded successfully" });
    },
    onError: (error) => {
      toast({
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
