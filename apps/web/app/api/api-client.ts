import { useAuthStore } from "~/modules/Auth/authStore";
import { API } from "./generated-api";
import { AuthenticationError } from "./types";

export const ApiClient = new API({
  baseURL: import.meta.env.VITE_API_URL,
  secure: true,
  withCredentials: true,
});

ApiClient.instance.interceptors.request.use((config) => {
  const isAuthEndpoint =
    config.url?.includes("/login") ||
    config.url?.includes("/refresh") ||
    config.url?.includes("/register");

  if (!isAuthEndpoint && !useAuthStore.getState().isLoggedIn) {
    throw new AuthenticationError("User not authenticated", "unauthenticated");
  }

  return config;
});

ApiClient.instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        await ApiClient.api.authControllerRefreshTokens();
        return ApiClient.instance(error.config);
      } catch {
        useAuthStore.getState().setLoggedIn(false);
        throw new AuthenticationError("Session expired", "unauthorized");
      }
    }
    return Promise.reject(error);
  }
);
