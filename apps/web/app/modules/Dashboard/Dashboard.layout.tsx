import { Outlet, redirect } from "@remix-run/react";

import { currentUserQueryOptions } from "~/api/queries/useCurrentUser";
import { queryClient } from "~/api/queryClient";
import { DashboardNavigation } from "~/modules/Dashboard/DashboardNavigation/DashboardNavigation";

import { useAuthEffect } from "../Auth/authEffect";

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
        <main className="flex-1 overflow-y-auto py-6 lg:p-6 bg-primary-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
