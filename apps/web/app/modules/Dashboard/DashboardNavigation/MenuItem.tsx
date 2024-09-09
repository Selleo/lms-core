import { memo } from "react";
import { MenuItemLink } from "./MenuItemLink";
import type { MenuItemType } from "./DashboardNavigation";

type MenuItemProps = {
  item: MenuItemType;
};

export const MenuItem = memo(({ item }: MenuItemProps) => {
  if ("children" in item) {
    return (
      <li className="w-full mt-4 max-w-[268px]">
        <span className="block font-medium text-gray-600 capitalize">
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
    <li className="h-8 w-full">
      <MenuItemLink {...item} />
    </li>
  );
});
