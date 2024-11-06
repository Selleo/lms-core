import { redirect } from "@remix-run/react";

import { useAuthStore } from "./authStore";

/**
 * @returns void
 * @description This function is used to rediect the user to the login page if they are not logged in.
 * @description Should be moved to middlewares once they are supported in Remix/ReactRouter7
 */
export function authGuard() {
  const authStore = useAuthStore.getState();

  if (!authStore.isLoggedIn) {
    return redirect("/auth/login");
  }

  return null;
}
