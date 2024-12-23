import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

import type { UpsertQuestionOptionsBody } from "../../generated-api";

type UpdateCategoryOptions = {
  data: UpsertQuestionOptionsBody;
  questionId: string;
};

export function useUpdateQuestionOptions() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: UpdateCategoryOptions) => {
      const response = await ApiClient.api.lessonsControllerUpsertQuestionOptions(options.data, {
        questionId: options.questionId,
      });

      return response.data;
    },
    onSuccess: () => {
      toast({ description: "Question options updated successfully" });
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
