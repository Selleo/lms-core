import { useAuthStore } from "./../../modules/Auth/authStore";
import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "../api-client";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { queryClient } from "../queryClient";

export function useLogoutUser() {
  const { setLoggedIn } = useAuthStore();
  return useMutation({
    mutationFn: async () => {
      const response = await ApiClient.auth.authControllerLogout();

      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
      setLoggedIn(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message);
      }
      toast.error(error.message);
    },
  });
}
