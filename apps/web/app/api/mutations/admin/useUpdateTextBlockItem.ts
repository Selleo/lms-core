import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "~/components/ui/use-toast";
import { ApiClient } from "../../api-client";
import { UpdateTextBlockItemBody } from "../../generated-api";

type UpdateTextBlockOptions = {
  data: UpdateTextBlockItemBody;
  textBlockId: string;
};

export function useUpdateTextBlockItem() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: UpdateTextBlockOptions) => {
      const response = await ApiClient.api.lessonsControllerUpdateTextBlockItem(
        options.data,
        {
          id: options.textBlockId,
        },
      );

      return response.data;
    },
    onSuccess: () => {
      toast({ description: "Text block updated successfully" });
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
