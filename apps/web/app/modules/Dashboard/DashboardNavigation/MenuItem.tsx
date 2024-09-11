import { memo } from "react";
import { MenuItemLink } from "./MenuItemLink";
import { Icon } from "~/components/Icon";
import type { MenuItemType } from "./DashboardNavigation";

type MenuItemProps = {
  item: MenuItemType;
};

export const MenuItem = memo(({ item }: MenuItemProps) => {
  if ("children" in item) {
    return (
      <li className="w-full my-2 h-8 p-2 mt-3">
        <div className="flex items-center border-b border-b-primary-200">
          <Icon name={"Directory"} className="w-4 h-4 mr-2 text-neutral-900" />
          <span className="block subtle text-neutral-900 capitalize  p-2">
            {item.label}
          </span>
        </div>
        <ul>
          {item.children.map((child) => (
            <div key={child.label} className="ml-4">
              <MenuItem item={child} />
            </div>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li className="my-2 h-8 w-full">
      <MenuItemLink {...item} />
    </li>
  );
});
