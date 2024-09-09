import { isEmpty } from "lodash-es";
import { useCurrentUserSuspense } from "~/api/queries/useCurrentUser";
import { cn } from "~/lib/utils";
import { useAuthorizedMenuItems } from "../hooks/useAuthorizedMenuItems";

import type { GetUsersResponse } from "~/api/generated-api";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { CaretDown, Dashboard, Directory, SelleoLogo } from "~/assets/svgs";
import { MenuItem } from "~/modules/Dashboard/DashboardNavigation/MenuItem";
import { IconName } from "~/types/shared";

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

const menuItems: MenuItemType[] = [
  {
    label: "dashboard",
    link: "/",
    roles: ["student"],
    iconName: "Dashboard",
  },
  {
    label: "courses",
    link: "/",
    roles: ["student, admin, tutor"],
    iconName: "Directory",
  },
];

export function DashboardNavigation() {
  const {
    data: { role, firstName, lastName, email },
  } = useCurrentUserSuspense();
  const authorizedMenuItems = useAuthorizedMenuItems({
    menuItems,
    userRole: role,
  });

  if (isEmpty(authorizedMenuItems)) {
    return null;
  }

  return (
    <aside
      className={cn(
        "w-[19.375rem] bg-muted/40 flex flex-col bg-white border-r border-r-primary-200",
      )}
    >
      <div className="py-9 w-full flex justify-center border-b-primary-200 border-b">
        <SelleoLogo />
      </div>
      <div className="p-[18px] mt-9 mx-auto max-w-[268px] bg-primary-50 rounded-md w-full flex items-center justify-between">
        <div className="flex gap-x-2">
          <Avatar>
            <AvatarImage src="https://ui-avatars.com/api/?name=User" />
            <AvatarFallback>
              {firstName[0]}
              {lastName[0]}
            </AvatarFallback>
          </Avatar>
          <hgroup className="flex flex-col *:subtle">
            <h2 className="text-neutral-900">
              {firstName} {lastName}
            </h2>
            <p className="text-neutral-500">{email}</p>
          </hgroup>
        </div>
        <CaretDown className="h-6 w-6" />
      </div>
      <nav className="flex flex-col">
        <ul className="flex flex-col items-center">
          {authorizedMenuItems.map((item) => (
            <MenuItem key={item.label} item={item} />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
