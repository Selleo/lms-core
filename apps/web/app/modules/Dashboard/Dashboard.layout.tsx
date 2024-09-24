import { Outlet, redirect } from "@remix-run/react";
import { useAuthEffect } from "../Auth/authEffect";
import { DashboardNavigation } from "./DashboardNavigation/DashboardNavigation";
import { LessonItemsProvider } from "../Courses/LessonItems/LessonItemsContext";
import { queryClient } from "~/api/queryClient";
import { currentUserQueryOptions } from "~/api/queries/useCurrentUser";

export const clientLoader = async () => {
  try {
    const user = await queryClient.ensureQueryData(currentUserQueryOptions);

    if (!user) {
      throw redirect("/auth/login");
    }
  } catch (error) {
    throw redirect("/auth/login");
  }

  return null;
};

export default function DashboardLayout() {
  useAuthEffect();

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <DashboardNavigation />
        <main className="flex-1 overflow-y-auto p-6 bg-primary-50">
          <LessonItemsProvider>
            <Outlet />
          </LessonItemsProvider>
        </main>
      </div>
    </div>
  );
}
