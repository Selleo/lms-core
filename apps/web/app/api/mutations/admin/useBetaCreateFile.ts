import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

import type { BetaCreateFileBody } from "../../generated-api";

type CreateFileOptions = {
  data: BetaCreateFileBody;
};

export function useBetaCreateFileItem() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: CreateFileOptions) => {
      const response = await ApiClient.api.lessonsControllerBetaCreateFile(options.data);

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