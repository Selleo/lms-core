import { useMutation } from "@tanstack/react-query";

import { useToast } from "~/components/ui/use-toast";

import { ApiClient } from "../../api-client";

const extractFileKeyFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.slice(1);
  } catch {
    return "";
  }
};

export function useDeleteFile() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (url: string) => {
      const fileKey = extractFileKeyFromUrl(url);
      return await ApiClient.api.fileControllerDeleteFile({
        fileKey,
      });
    },
    onError: (error) => {
      toast({
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
