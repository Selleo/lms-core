import { useMemo } from "react";
import { MenuItemType, Role } from "../types";

interface UseAuthorizedMenuItems {
  menuItems: MenuItemType[] | undefined;
  userRole: Role;
}

export const useAuthorizedMenuItems = ({
  menuItems,
  userRole,
}: UseAuthorizedMenuItems) => {
  return useMemo(() => {
    if (!menuItems || !Array.isArray(menuItems)) {
      return [];
    }

    const filterMenuItems = (items: MenuItemType[]): MenuItemType[] => {
      return items.reduce<MenuItemType[]>((acc, item) => {
        if (item.roles.includes(userRole)) {
          if ("children" in item && Array.isArray(item.children)) {
            const filteredChildren = filterMenuItems(item.children);
            if (filteredChildren.length > 0) {
              acc.push({ ...item, children: filteredChildren });
            }
          } else if ("link" in item) {
            acc.push(item);
          }
        }
        return acc;
      }, []);
    };

    return filterMenuItems(menuItems);
  }, [menuItems, userRole]);
};
