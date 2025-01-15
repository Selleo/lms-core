import { Outlet, redirect } from "@remix-run/react";
import { useTranslation } from "react-i18next";

import { currentUserQueryOptions } from "~/api/queries/useCurrentUser";
import { queryClient } from "~/api/queryClient";
import { Navigation } from "~/components/Navigation";
import { getNavigationConfig, mapNavigationItems } from "~/config/navigationConfig";
import { RouteGuard } from "~/Guards/RouteGuard";
import { useCurrentUserStore } from "~/modules/common/store/useCurrentUserStore";

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
  const { t } = useTranslation();
  const { currentUser } = useCurrentUserStore();
  useAuthEffect();

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 flex-col overflow-hidden 2xl:flex-row">
        <Navigation
          menuItems={mapNavigationItems(
            getNavigationConfig(currentUser?.id ?? "", currentUser?.role === "user", t),
          )}
        />
        <main className="bg-primary-50 flex-1 overflow-y-auto">
          <RouteGuard>
            <Outlet />
          </RouteGuard>
        </main>
      </div>
    </div>
  );
}
