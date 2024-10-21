import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "~/components/ui/use-toast";
import { ApiClient } from "../api-client";

type SubmitQuizProps = {
  handleOnSuccess: () => void;
};

export function useClearQuizProgress({ handleOnSuccess }: SubmitQuizProps) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (answer: { lessonId: string }) => {
      const response =
        await ApiClient.api.lessonsControllerClearQuizProgress(answer);

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
