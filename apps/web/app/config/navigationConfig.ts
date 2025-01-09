import { routeAccessConfig } from "./routeAccessConfig";

import type { UserRole } from "./userRoles";
import type { IconName } from "~/types/shared";
import { t } from "i18next";

export interface BaseMenuItem {
  label: string;
  roles?: UserRole[];
}

export interface LeafMenuItem extends BaseMenuItem {
  link: string;
  iconName: IconName;
}

export type MenuItemType = LeafMenuItem;

export type NavigationItem = {
  label: string;
  path: string;
  iconName: IconName;
};

export const navigationConfig: NavigationItem[] = [
  {
    label: t("navigationSideBar.dashboard"),
    path: "",
    iconName: "Dashboard",
  },
  {
    label: t("navigationSideBar.courses"),
    path: "courses",
    iconName: "Course",
  },
];

export const adminNavigationConfig: NavigationItem[] = [
  {
    label: t("navigationSideBar.courses"),
    path: "admin/courses",
    iconName: "Course",
  },
  {
    label: t("navigationSideBar.categories"),
    path: "admin/categories",
    iconName: "Category",
  },
  {
    label: t("navigationSideBar.users"),
    path: "admin/users",
    iconName: "User",
  },
];

export const findMatchingRoute = (path: string) => {
  if (routeAccessConfig[path]) {
    return routeAccessConfig[path];
  }

  const wildcardRoutes = Object.entries(routeAccessConfig).filter(([route]) => route.includes("*"));

  for (const [route, roles] of wildcardRoutes) {
    const routeWithoutWildcard = route.replace("/*", "");
    if (path.startsWith(routeWithoutWildcard)) {
      return roles;
    }
  }

  return undefined;
};

export const mapNavigationItems = (items: NavigationItem[]) => {
  return items.map((item) => {
    const roles = findMatchingRoute(item.path);

    return {
      ...item,
      link: `/${item.path}`,
      roles,
    };
  });
};
