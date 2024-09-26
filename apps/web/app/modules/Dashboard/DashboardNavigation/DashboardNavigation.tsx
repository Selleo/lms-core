import { isEmpty } from "lodash-es";
import { useCurrentUserSuspense } from "~/api/queries/useCurrentUser";
import { useAuthorizedMenuItems } from "../hooks/useAuthorizedMenuItems";

import type { GetUsersResponse } from "~/api/generated-api";
import { useLogoutUser } from "~/api/mutations/useLogoutUser";
import { SelleoLogo } from "~/assets/svgs";
import { Icon } from "~/components/Icon";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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

//tests routes - to be adjusted
const menuItems: MenuItemType[] = [
  {
    label: "dashboard",
    link: "/",
    roles: ["admin", "student"],
    iconName: "Dashboard",
  },{
    label: "settings",
    link: "/settings",
    roles: ["admin", "student"],
    iconName: "Settings",
  }
];

export function DashboardNavigation() {
  const { mutate: logout } = useLogoutUser();
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
    <aside className="w-[240px] bg-muted/40 flex flex-col bg-white border-r border-r-primary-200">
      <div className="py-9 w-full flex justify-center border-b-primary-200 border-b">
        <SelleoLogo />
      </div>

      <div className="flex flex-col mx-5">
        <div className="my-9 p-[18px] max-w-[268px] bg-primary-50 rounded-md w-full flex items-center justify-between">
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

        <nav>
          <ul className="flex flex-col items-center">
            {authorizedMenuItems.map((item) => (
              <MenuItem key={item.label} item={item} />

            ))}
          </ul>

        </nav>
      </div>

      <div className="flex items-center border-t border-t-primary-200 w-full mt-auto">
        <button
          onClick={() => logout()}
          className="flex items-center rounded-md hover:bg-primary-50 subtle font-md gap-x-2 w-full mx-5 px-2 py-4"
        >
          <Icon name="Logout" className="w-4 h-4" />
          <span className="subtle text-neutral-900">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
