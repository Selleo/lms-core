import { useAuthStore } from "~/modules/Auth/authStore";
import { API } from "./generated-api";

const isTestEnv = process.env.NODE_ENV === "test";

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

  if (!isTestEnv && !isAuthEndpoint && !useAuthStore.getState().isLoggedIn) {
    const controller = new AbortController();
    controller.abort();
    config.signal = controller.signal;
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
      }
    }
    return Promise.reject(error);
  }
);
