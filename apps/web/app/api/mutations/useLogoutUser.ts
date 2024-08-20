import { useAuthStore } from "./../../modules/Auth/authStore";
import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "../api-client";
import { useToast } from "~/components/ui/use-toast";
import { AxiosError } from "axios";
import { queryClient } from "../queryClient";

export function useLogoutUser() {
  const { toast } = useToast();
  const { setLoggedIn } = useAuthStore();
  return useMutation({
    mutationFn: async () => {
      const response = await ApiClient.api.authControllerLogout();

      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
      setLoggedIn(false);
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
