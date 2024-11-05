import { isEmpty } from "lodash-es";
import { useAuthorizedMenuItems } from "../hooks/useAuthorizedMenuItems";

import { useLocation, useNavigate } from "@remix-run/react";
import { cx } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import { Suspense, useState } from "react";
import type { GetUsersResponse } from "~/api/generated-api";
import { SelleoLogo } from "~/assets/svgs";
import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { useUserRole } from "~/hooks/useUserRole";
import { MenuItem } from "~/modules/Dashboard/DashboardNavigation/MenuItem";
import type { IconName } from "~/types/shared";
import { LogoutButton } from "./LogoutButton";
import { UserProfile } from "./UserProfile";
import Loader from "~/modules/common/Loader/Loader";

export type Role = GetUsersResponse["data"][number]["role"];

export interface BaseMenuItem {
  label: string;
  roles: Role[];
}

export interface LeafMenuItem extends BaseMenuItem {
  link: string;
  iconName: IconName;
}

export interface ParentMenuItem extends BaseMenuItem {
  children: MenuItemType[];
}

export type MenuItemType = LeafMenuItem | ParentMenuItem;

//tests routes - to be adjusted
const menuItems: MenuItemType[] = [
  {
    label: "dashboard",
    link: "/",
    roles: ["admin", "student"],
    iconName: "Dashboard",
  },
  {
    label: "settings",
    link: "/settings",
    roles: ["admin", "student"],
    iconName: "Settings",
  },
];

export function DashboardNavigation({
  menuItemsOverwrite,
}: {
  menuItemsOverwrite?: MenuItemType[];
}) {
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { role } = useUserRole();
  const authorizedMenuItems = useAuthorizedMenuItems({
    menuItems: menuItemsOverwrite ?? menuItems,
    userRole: role,
  });
  const isAdminRoute = pathname.startsWith("/admin");

  if (isEmpty(authorizedMenuItems)) {
    return null;
  }

  return (
    <>
      <button
        aria-label="Open sidebar"
        className={cx(
          "fixed top-6 lg:sr-only right-6 bg-white z-10 drop-shadow rounded-lg p-2 grid place-items-center",
          {
            "sr-only": isOpen,
          },
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Icon name="HamburgerMenu" className="w-6 h-6" />
      </button>
      <aside
        className={cx(
          "w-[240px] bg-muted/40 fixed lg:static top-0 right-0 z-10 h-dvh flex flex-col gap-4 bg-white p-4 drop-shadow-primary duration-300",
          {
            "translate-x-full lg:translate-x-0": !isOpen,
            "translate-x-0 lg:translate-x-0": isOpen,
          },
        )}
      >
        <div className="lg:sr-only">
          <button
            className="rotate-180"
            aria-label="Close sidebar"
            onClick={() => setIsOpen(false)}
          >
            <Icon name="HamburgerMenuClose" className="w-6 h-6" />
          </button>
        </div>
        <div className="pt-4 pb-8 lg:py-8 w-full flex justify-center border-b-primary-200 border-b">
          <SelleoLogo />
        </div>

        <div className="flex flex-col h-full">
          <nav>
            <ul className="flex flex-col items-center">
              {authorizedMenuItems.map((item) => (
                <MenuItem key={item.label} item={item} />
              ))}
            </ul>
          </nav>
        </div>
        <Suspense fallback={<Loader />}>
          <UserProfile />
        </Suspense>
        <div className="flex items-center border-t border-t-primary-200 w-full pt-4 gap-2 flex-col">
          {isAdmin && (
            <Button
              className="w-full justify-start gap-2"
              variant="outline"
              onClick={() => navigate(isAdminRoute ? "/" : "/admin/courses")}
            >
              {`Go to ${isAdminRoute ? "Dashboard" : "Admin"}`}
              <ArrowRight className="w-4 h-4 inline-block text-primary-700" />
            </Button>
          )}
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
