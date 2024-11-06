import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "~/components/ui/use-toast";

import { currentLessonItemsQueryOptions } from "../queries/useCurrentLessonItem";
import { queryClient } from "../queryClient";

//TODO: Connect to the database when the backend is completed

type UpdateLessonItemOptions = {
  data: {
    name: string;
    displayName: string;
    description: string;
    video: string | File | FileList | null;
  }; //TODO: The generated API does not have a type for this
};

export function useUpdateLessonItem(id: string) {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: UpdateLessonItemOptions) => {
      //TODO: Waiting for backend features
      const response = await {
        currentLesson: id,
        ...options.data,
      };

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(currentLessonItemsQueryOptions);
      toast({ description: "User updated successfully" });
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
