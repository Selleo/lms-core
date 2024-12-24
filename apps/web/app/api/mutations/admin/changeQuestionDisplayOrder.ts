import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

type ChangeQuestionDisplayOrderOptions = {
  questionAnswer: { questionId: string; displayOrder: number };
};

export function useChangeQuestionDisplayOrder() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: ChangeQuestionDisplayOrderOptions) => {
      const response = await ApiClient.api.questionControllerUpdateQuestionDisplayOrder(
        options.questionAnswer,
      );

      return response.data;
    },
    onSuccess: () => {
      toast({ description: "Question display order updated successfully" });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast({
          description: error.response?.data.message || "An error occurred while updating.",
          variant: "destructive",
        });
      }
      toast({
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });
}
