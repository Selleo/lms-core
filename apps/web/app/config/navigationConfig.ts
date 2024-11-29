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

export interface ParentMenuItem extends BaseMenuItem {
  children: MenuItemType[];
}

export type MenuItemType = LeafMenuItem;

export type NavigationItem = {
  label: string;
  path: string;
  iconName: IconName;
};

export const navigationConfig: NavigationItem[] = [
  {
    label: "dashboard",
    path: "",
    iconName: "Dashboard",
  },
  {
    label: "courses",
    path: "courses",
    iconName: "Course",
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
    label: "lessons",
    path: "admin/lessons",
    iconName: "Lesson",
  },
  {
    label: "users",
    path: "admin/users",
    iconName: "User",
  },
  {
    label: "Lesson Content",
    path: "admin/lesson-items",
    iconName: "LessonContent",
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
