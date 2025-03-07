import { useCurrentUserSuspense } from "~/api/queries";
import { USER_ROLE } from "~/config/userRoles";

export const useUserRole = () => {
  const {
    data: { role },
  } = useCurrentUserSuspense();

  const isAdmin = role === USER_ROLE.admin;
  const isTeacher = role === USER_ROLE.teacher;
  const isAdminLike = isAdmin || isTeacher;

  return { role, isAdmin, isTeacher, isAdminLike };
};
