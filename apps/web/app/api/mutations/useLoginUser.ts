import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAuthStore } from "~/modules/Auth/authStore";
import { ApiClient } from "../api-client";
import { LoginBody } from "../generated-api";
import { useToast } from "~/components/ui/use-toast";

type LoginUserOptions = {
  data: LoginBody;
};

export function useLoginUser() {
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (options: LoginUserOptions) => {
      const response = await ApiClient.auth.authControllerLogin(options.data);

      return response.data;
    },
    onSuccess: () => {
      setLoggedIn(true);
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
