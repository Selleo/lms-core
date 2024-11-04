import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "~/components/ui/use-toast";
import { ApiClient } from "../../api-client";
import type { CreateCategoryBody } from "../../generated-api";

type CreateCategoryOptions = {
  data: CreateCategoryBody;
};

export function useCreateCategory() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: CreateCategoryOptions) => {
      const response = await ApiClient.api.categoriesControllerCreateCategory(
        options.data,
      );

      return response.data;
    },
    onSuccess: () => {
      toast({
        variant: "default",
        description: "Category created successfully",
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
