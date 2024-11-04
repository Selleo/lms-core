import { useAuthStore } from "./../../modules/Auth/authStore";
import { useMutation } from "@tanstack/react-query";
import { requestManager, ApiClient } from "../api-client";
import { useToast } from "~/components/ui/use-toast";
import { AxiosError } from "axios";
import { queryClient } from "../queryClient";
import { useNavigate } from "@remix-run/react";

export function useLogoutUser() {
  const { toast } = useToast();
  const { setLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      requestManager.abortAll();

      const response = await ApiClient.api.authControllerLogout();
      setLoggedIn(false);
      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
      navigate("/auth/login");
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
