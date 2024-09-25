import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "~/components/ui/use-toast";
import { ApiClient } from "../api-client";
import { AnswerQuestionBody } from "../generated-api";

type AnswerData = {
  data: AnswerQuestionBody;
};

export function useQuestionAnswer() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (answer: AnswerData) => {
      const response = await ApiClient.api.questionsControllerAnswerQuestion(
        answer.data
      );

      return response.data;
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
