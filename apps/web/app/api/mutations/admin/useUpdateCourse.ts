import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useToast } from "~/components/ui/use-toast";
import { ApiClient } from "../../api-client";
import { UpdateCourseBody } from "../../generated-api";

type UpdateCourseOptions = {
  data: UpdateCourseBody;
  courseId: string;
};

export function useUpdateCourse() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: UpdateCourseOptions) => {
      const response = await ApiClient.api.coursesControllerUpdateCourse(
        options.courseId,
        options.data,
      );

      return response.data;
    },
    onSuccess: () => {
      toast({ description: "Course updated successfully" });
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
