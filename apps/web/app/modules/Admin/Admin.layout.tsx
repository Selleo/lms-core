import { type MetaFunction, Outlet, redirect, useLocation, useNavigate } from "@remix-run/react";
import { Suspense, useLayoutEffect } from "react";

import { currentUserQueryOptions } from "~/api/queries";
import { queryClient } from "~/api/queryClient";
import { Navigation } from "~/components/Navigation";
import { adminNavigationConfig, mapNavigationItems } from "~/config/navigationConfig";
import { RouteGuard } from "~/Guards/RouteGuard";
import { useUserRole } from "~/hooks/useUserRole";

import Loader from "../common/Loader/Loader";

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

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isTutor } = useUserRole();
  const navigate = useNavigate();

  const isAllowed = isAdmin || isTutor;

  useLayoutEffect(() => {
    if (!isAllowed) {
      navigate("/");
    }
  }, [isAllowed, navigate]);

  if (!isAllowed) return null;

  return <>{children}</>;
};

const AdminLayout = () => {
  const location = useLocation();
  const hideTopbarAndSidebar = location.pathname === "/admin/beta-courses/new";

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 flex-col 2xl:flex-row overflow-hidden">
        {!hideTopbarAndSidebar && (
          <Navigation menuItems={mapNavigationItems(adminNavigationConfig)} />
        )}
        <main className="flex-1 overflow-y-auto p-6 bg-primary-50">
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
