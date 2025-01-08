import { routeAccessConfig } from "./routeAccessConfig";

import type { UserRole } from "./userRoles";
import type { IconName } from "~/types/shared";

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

export const getNavigationConfig = (userId: string, isUser = true): NavigationItem[] => [
  {
    label: "dashboard",
    path: "",
    iconName: "Dashboard",
  },
  {
    label: "My Courses",
    path: "admin/courses",
    iconName: "Course",
  },
  {
    label: isUser ? "Courses" : "Browse Courses",
    path: "courses",
    iconName: isUser ? "Course" : "Multi",
  },
  {
    label: "categories",
    path: "admin/categories",
    iconName: "Category",
  },
  {
    label: "users",
    path: "admin/users",
    iconName: "Hat",
  },
  {
    label: "Profile",
    path: `teachers/${userId}`,
    iconName: "User",
  },
];

export const adminNavigationConfig: NavigationItem[] = [
  {
    label: "courses",
    path: "admin/courses",
    iconName: "Course",
  },
  {
    label: "categories",
    path: "admin/categories",
    iconName: "Category",
  },
  {
    label: "users",
    path: "admin/users",
    iconName: "User",
  },
];

export const findMatchingRoute = (path: string) => {
  if (routeAccessConfig[path]) {
    console.log("mariusz ->", routeAccessConfig[path]);
    return routeAccessConfig[path];
  }

  const wildcardRoutes = Object.entries(routeAccessConfig).filter(([route]) => route.includes("*"));
  for (const [route, roles] of wildcardRoutes) {
    const routeWithoutWildcard = route.replace("/*", "");
    console.log({ routeWithoutWildcard });
    if (path.startsWith(routeWithoutWildcard)) {
      console.log({ roles });
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
