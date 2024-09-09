import { Outlet } from "@remix-run/react";
import { useLogoutUser } from "~/api/mutations/useLogoutUser";
import { useAuthEffect } from "../Auth/authEffect";
import { authGuard } from "../Auth/authGuard";
import { DashboardNavigation } from "./DashboardNavigation/DashboardNavigation";
import { LessonItemsProvider } from "../Courses/LessonItems/LessonItemsContext";
import {
  currentUserQueryOptions,
  useCurrentUserSuspense,
} from "~/api/queries/useCurrentUser";
import { upperFirstLetter } from "./hooks/useUpperFirstLetter";
import { useMemo } from "react";
import { queryClient } from "~/api/queryClient";

export const clientLoader = async () => {
  await queryClient.prefetchQuery(currentUserQueryOptions);
  return authGuard();
};

export default function DashboardLayout() {
  useAuthEffect();
  const { mutate: logout } = useLogoutUser();
  const {
    data: { firstName, lastName },
  } = useCurrentUserSuspense();

  const userFullName = useMemo(
    () => upperFirstLetter([firstName, lastName]),
    [firstName, lastName],
  );

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <DashboardNavigation />
        <main className="flex-1 overflow-y-auto p-6">
          <LessonItemsProvider>
            <Outlet />
          </LessonItemsProvider>
        </main>
      </div>
    </div>
  );
}
