import { MetaFunction, Outlet, useNavigate } from "@remix-run/react";
import { DashboardNavigation } from "../Dashboard/DashboardNavigation/DashboardNavigation";
import { useUserRole } from "~/hooks/useUserRole";
import { useLayoutEffect } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Admin" }];
};

const AdminLayout = () => {
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <DashboardNavigation
          menuItemsOverwrite={[
            {
              label: "courses",
              link: "courses",
              roles: ["admin"],
              iconName: "CaretRight",
            },
            {
              label: "categories",
              link: "categories",
              roles: ["admin"],
              iconName: "CaretRight",
            },
            {
              label: "lessons",
              link: "lessons",
              roles: ["admin"],
              iconName: "CaretRight",
            },
            {
              label: "users",
              link: "users",
              roles: ["admin"],
              iconName: "CaretRight",
            },
          ]}
        />
        <main className="flex-1 overflow-y-auto p-6 bg-primary-50">
          {isAdmin && <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
