import { type MetaFunction, Outlet, redirect, useNavigate } from "@remix-run/react";
import { Suspense, useLayoutEffect } from "react";

import { currentUserQueryOptions } from "~/api/queries";
import { queryClient } from "~/api/queryClient";
import { useUserRole } from "~/hooks/useUserRole";

import Loader from "../common/Loader/Loader";
import { DashboardNavigation } from "../Dashboard/DashboardNavigation/DashboardNavigation";

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
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return <>{children}</>;
};

const AdminLayout = () => {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <DashboardNavigation
          menuItemsOverwrite={[
            {
              label: "courses",
              link: "courses",
              roles: ["admin"],
              iconName: "Course",
            },
            {
              label: "categories",
              link: "categories",
              roles: ["admin"],
              iconName: "Category",
            },
            {
              label: "lessons",
              link: "lessons",
              roles: ["admin"],
              iconName: "Lesson",
            },
            {
              label: "users",
              link: "users",
              roles: ["admin"],
              iconName: "User",
            },
            {
              label: "Lesson Content",
              link: "lesson-items",
              roles: ["admin"],
              iconName: "LessonContent",
            },
          ]}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-primary-50">
          <Suspense fallback={<Loader />}>
            <AdminGuard>
              <Outlet />
            </AdminGuard>
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
