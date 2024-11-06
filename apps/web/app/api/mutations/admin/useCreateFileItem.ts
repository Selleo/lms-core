import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

import type { CreateFileBody } from "../../generated-api";

type CreateFileOptions = {
  data: CreateFileBody;
};

export function useCreateFileItem() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: CreateFileOptions) => {
      const response = await ApiClient.api.lessonsControllerCreateFile(options.data);

      return response.data;
    },
    onSuccess: () => {
      toast({
        variant: "default",
        description: "File item created successfully",
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
