import { type MetaFunction, Outlet, redirect, useLocation, useNavigate } from "@remix-run/react";
import { Suspense, useLayoutEffect } from "react";
import { match } from "ts-pattern";

import { currentUserQueryOptions } from "~/api/queries";
import { queryClient } from "~/api/queryClient";
import { Navigation } from "~/components/Navigation";
import { getNavigationConfig, mapNavigationItems } from "~/config/navigationConfig";
import { RouteGuard } from "~/Guards/RouteGuard";
import { useUserRole } from "~/hooks/useUserRole";
import { cn } from "~/lib/utils";
import { useCurrentUserStore } from "~/modules/common/store/useCurrentUserStore";

import Loader from "../common/Loader/Loader";

import type { PropsWithChildren } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Admin" }];
};

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

const AdminGuard = ({ children }: PropsWithChildren) => {
  const { isAdmin, isTeacher } = useUserRole();
  const navigate = useNavigate();

  const isAllowed = isAdmin || isTeacher;

  useLayoutEffect(() => {
    if (!isAllowed) {
      navigate("/");
    }
  }, [isAllowed, navigate]);

  if (!isAllowed) return null;

  return <>{children}</>;
};

const AdminLayout = () => {
  const { currentUser } = useCurrentUserStore();
  const { pathname } = useLocation();

  const hideTopbarAndSidebar = match(pathname)
    .with("/admin/beta-courses/new", () => true)
    .with("/admin/courses/new-scorm", () => true)
    .otherwise(() => false);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 flex-col overflow-hidden 2xl:flex-row">
        {!hideTopbarAndSidebar && (
          <Navigation
            menuItems={mapNavigationItems(getNavigationConfig(currentUser?.id ?? "", false))}
          />
        )}
        <main
          className={cn("bg-primary-50 flex-1 overflow-y-auto max-h-dvh p-6", {
            "bg-white p-0": hideTopbarAndSidebar,
          })}
        >
          <Suspense fallback={<Loader />}>
            <AdminGuard>
              <RouteGuard>
                <Outlet />
              </RouteGuard>
            </AdminGuard>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
