import { Outlet, redirect } from "@remix-run/react";

import { currentUserQueryOptions } from "~/api/queries/useCurrentUser";
import { queryClient } from "~/api/queryClient";
import { Navigation } from "~/components/Navigation";
import { mapNavigationItems, navigationConfig } from "~/config/navigationConfig";
import { RouteGuard } from "~/Guards/RouteGuard";
import { useAuthEffect } from "~/modules/Auth/authEffect";

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

export default function LessonLayout() {
  useAuthEffect();

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex flex-1 flex-col 2xl:flex-row overflow-hidden">
        <Navigation menuItems={mapNavigationItems(navigationConfig)} />
        <main className="flex-1 overflow-y-auto bg-primary-50">
          <RouteGuard>
            <Outlet />
          </RouteGuard>
        </main>
      </div>
    </div>
  );
}
