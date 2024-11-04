import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { isSilentError } from "./types";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry(failureCount, error: unknown) {
        if (isSilentError(error)) return false;

        if (isAxiosError(error)) {
          if (error.response?.status === 401) return false;
        }

        if (failureCount >= 3) return false;

        return true;
      },
    },
    mutations: {
      retry(failureCount, error: unknown) {
        if (isSilentError(error)) return false;

        if (isAxiosError(error)) {
          if (error.response?.status === 401) return false;
        }

        if (failureCount >= 3) return false;

        return true;
      },
    },
  },
});
