import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "~/components/ui/use-toast";
import { ApiClient } from "../../api-client";
import { UpdateCategoryBody } from "../../generated-api";

type UpdateCategoryOptions = {
  data: UpdateCategoryBody;
  categoryId: string;
};

export function useUpdateCategory() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: UpdateCategoryOptions) => {
      const response = await ApiClient.api.categoriesControllerUpdateCategory(
        options.categoryId,
        options.data
      );

      return response.data;
    },
    onSuccess: () => {
      toast({ description: "Category updated successfully" });
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
