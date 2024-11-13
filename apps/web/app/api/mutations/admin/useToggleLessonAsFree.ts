import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

import type { ToggleLessonAsFreeBody } from "../../generated-api";

type ToggleLessonOptions = {
  data: ToggleLessonAsFreeBody;
};

export function useToggleLessonAsFree() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: ToggleLessonOptions) => {
      const response = await ApiClient.api.lessonsControllerToggleLessonAsFree(options.data);

      return response.data;
    },
    onSuccess: ({ data }) => {
      toast({ description: data.message ?? "Lesson toggled as free successfully" });
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
