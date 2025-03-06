import { ApiClient } from "~/api/api-client";
import { useCurrentUserStore } from "~/modules/common/store/useCurrentUserStore";

import { useAuthStore } from "./authStore";

export const authService = {
  logout() {
    useAuthStore.setState({ isLoggedIn: false });
    useCurrentUserStore.setState({ currentUser: undefined });
  },

  async refreshToken() {
    return ApiClient.api.authControllerRefreshTokens();
  },
};
