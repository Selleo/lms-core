"use client";
import { isEmpty } from "lodash-es";
import { useCurrentUserSuspense } from "~/api/queries/useCurrentUser";
import { useAuthorizedMenuItems } from "../hooks/useAuthorizedMenuItems";

import type { GetUsersResponse } from "~/api/generated-api";
import { useLogoutUser } from "~/api/mutations/useLogoutUser";
import { SelleoLogo } from "~/assets/svgs";
import { Icon } from "~/components/Icon";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { MenuItem } from "~/modules/Dashboard/DashboardNavigation/MenuItem";
import type { IconName } from "~/types/shared";
import { Button } from "~/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "@remix-run/react";
import { useUserRole } from "~/hooks/useUserRole";
import { useState } from "react";
import { cx } from "class-variance-authority";

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
  const { mutate: logout } = useLogoutUser();
  const {
    data: { role, firstName, lastName, email },
  } = useCurrentUserSuspense();
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
          }
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
          }
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

        <div className="p-[18px] max-w-[268px] bg-primary-50 rounded-md w-full flex items-center justify-between mt-auto">
          <div className="flex gap-x-2 min-w-0">
            <Avatar>
              <AvatarImage src="https://ui-avatars.com/api/?name=User" />
              <AvatarFallback>
                {firstName[0]}
                {lastName[0]}
              </AvatarFallback>
            </Avatar>
            <hgroup className="flex flex-col subtle min-w-0">
              <h2 className="text-neutral-900">
                {firstName} {lastName}
              </h2>
              <p className="text-neutral-500 truncate min-w-0">{email}</p>
            </hgroup>
          </div>
        </div>
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
          <button
            onClick={() => logout()}
            className="flex items-center rounded-md hover:bg-primary-50 subtle font-md gap-x-2 w-full p-2"
          >
            <Icon name="Logout" className="w-4 h-4" />
            <span className="subtle text-neutral-900">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
