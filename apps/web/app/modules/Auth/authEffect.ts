import { useEffect } from "react";
import { useAuthStore } from "./authStore";
import { useNavigate } from "@remix-run/react";

/**
 * @returns void
 * @description This hook is used to rediect the user to the login page if they are not logged in.
 */
export function useAuthEffect() {
  const loggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) {
      navigate("/auth/login");
    }
  }, [loggedIn, navigate]);
}
