import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "~/components/ui/use-toast";
import { ApiClient } from "../../api-client";
import { CreateQuestionBody } from "../../generated-api";

type CreateQuestonOptions = {
  data: CreateQuestionBody;
};

export function useCreateQuestionItem() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: CreateQuestonOptions) => {
      const response = await ApiClient.api.lessonsControllerCreateQuestion(
        options.data
      );

      return response.data;
    },
    onSuccess: () => {
      toast({
        variant: "default",
        description: "Question created successfully",
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
