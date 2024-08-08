import { useAuthStore } from "~/modules/Auth/authStore";
import { API } from "./generated-api";

export const ApiClient = new API({
  baseURL: import.meta.env.VITE_API_URL,
  secure: true,
  withCredentials: true,
});

ApiClient.instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isLoginRequest = originalRequest.url.includes("/login");

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isLoginRequest && useAuthStore.getState().isLoggedIn) {
        try {
          await ApiClient.auth.authControllerRefreshTokens();
          return ApiClient.instance(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().setLoggedIn(false);
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);
