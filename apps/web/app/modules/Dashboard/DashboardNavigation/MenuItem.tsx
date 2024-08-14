import { memo } from "react";
import { MenuItemLink } from "./MenuItemLink";
import type { MenuItemType } from "./DashboardNavigation";

export const MenuItem = memo(({ item }: { item: MenuItemType }) => {
  if ("children" in item) {
    return (
      <li className="w-full mt-4">
        <span className="block px-5 py-2 font-medium text-gray-600 capitalize">
          {item.label}
        </span>
        <ul>
          {item.children.map((child) => (
            <MenuItem key={child.label} item={child} />
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li className="h-14 w-full">
      <MenuItemLink {...item} />
    </li>
  );
});
