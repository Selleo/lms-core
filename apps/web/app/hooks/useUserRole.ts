import { useCurrentUserSuspense } from "~/api/queries/useCurrentUser";

export const useUserRole = () => {
  const {
    data: { role },
  } = useCurrentUserSuspense();

  const isAdmin = role === "admin";

  return { role, isAdmin };
};
