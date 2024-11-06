import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";
import { type UpdateQuestionItemBody } from "../../generated-api";

type UpdateQuestionOptions = {
  data: UpdateQuestionItemBody;
  questionId: string;
};

export function useUpdateQuestionItem() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: UpdateQuestionOptions) => {
      const response = await ApiClient.api.lessonsControllerUpdateQuestionItem(options.data, {
        id: options.questionId,
      });

      return response.data;
    },
    onSuccess: () => {
      toast({ description: "Question updated successfully" });
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
