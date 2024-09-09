import { Outlet } from "@remix-run/react";
import { useAuthEffect } from "../Auth/authEffect";
import { DashboardNavigation } from "./DashboardNavigation/DashboardNavigation";
import { LessonItemsProvider } from "../Courses/LessonItems/LessonItemsContext";

export default function DashboardLayout() {
  useAuthEffect();

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
