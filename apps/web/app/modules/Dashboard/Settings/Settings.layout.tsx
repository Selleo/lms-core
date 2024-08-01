import { Link, Outlet, useLocation } from "@remix-run/react";
import { replace } from "lodash-es";
import { cn } from "~/lib/utils";

export default function SettingsLayout() {
  const { hash } = useLocation();
  const currentTab = replace(hash, "#", "") || "user-info";

  const navigationItems = [
    {
      id: "user-info",
      title: "User Info",
    },
    {
      id: "change-password",
      title: "Change Password",
    },
  ];

  return (
    <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr] p-4">
      <nav className="grid gap-4 text-sm text-muted-foreground">
        <h1 className="text-3xl font-semibold text-primary">Settings</h1>
        {navigationItems.map((item) => (
          <Link
            key={item.id}
            to={`#${item.id}`}
            className={cn({
              "text-primary": currentTab === item.id,
            })}
          >
            {item.title}
          </Link>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
