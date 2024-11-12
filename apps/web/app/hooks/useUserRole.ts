import { useCurrentUserSuspense } from "~/api/queries";

export const useUserRole = () => {
  const {
    data: { role },
  } = useCurrentUserSuspense();

  const isAdmin = role === "admin";
  const isTutor = role === "tutor";

  return { role, isAdmin, isTutor };
};
