import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "~/components/ui/use-toast";
import { ApiClient } from "../api-client";
import type { CreateCourseBody } from "../generated-api";
import { currentUserQueryOptions } from "~/api/queries";
import { queryClient } from "../queryClient";

type CreateCourseOptions = {
  data: CreateCourseBody;
};

export function useCreateCourse() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: CreateCourseOptions) => {
      const response = await ApiClient.api.coursesControllerCreateCourse(
        options.data,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(currentUserQueryOptions);
      toast({ description: "Course created successfully" });
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
