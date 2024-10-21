import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "~/components/ui/use-toast";
import { ApiClient } from "../api-client";
import { AnswerQuestionBody } from "../generated-api";

type SubmitQuizProps = {
  handleOnSuccess: () => void;
};

export function useSubmitQuiz({ handleOnSuccess }: SubmitQuizProps) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (answer: AnswerQuestionBody) => {
      const response =
        await ApiClient.api.lessonsControllerEvaluationQuiz(answer);

      return response.data;
    },
    onSuccess: () => {
      handleOnSuccess();
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
