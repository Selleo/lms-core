import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "~/components/ui/use-toast";
import { ApiClient } from "../api-client";

type EnrollCourseOptions = {
  id: string;
};

export function useEnrollCourse() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: EnrollCourseOptions) => {
      const response =
        await ApiClient.api.coursesControllerCreateFavouritedCourse({
          id: options.id,
        });

      return response.data;
    },
    onSuccess: ({ data }) => {
      toast({
        variant: "default",
        description: data.message,
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
