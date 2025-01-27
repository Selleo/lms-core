import { NavLink } from "@remix-run/react";

import { Icon } from "~/components/Icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

import type { Dispatch, SetStateAction } from "react";
import type { MenuItemType } from "~/config/navigationConfig";

type NavigationMenuItemProps = {
  item: MenuItemType;
  setIsMobileNavOpen: Dispatch<SetStateAction<boolean>>;
};

export function NavigationMenuItem({ item, setIsMobileNavOpen }: NavigationMenuItemProps) {
  return (
    <li key={item.label}>
      <Tooltip>
        <TooltipTrigger className="w-full">
          <NavLink
            to={item.link}
            onClick={() => setIsMobileNavOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex gap-x-3 items-center py-3.5 px-4 rounded-lg 2xl:p-2 hover:bg-primary-700 hover:text-white",
                {
                  "bg-primary-700 text-white": isActive,
                  "bg-white text-neutral-900": !isActive,
                },
              )
            }
          >
            <Icon name={item.iconName} className="size-6" />
            <span className="capitalize 2xl:sr-only 3xl:not-sr-only">{item.label}</span>
          </NavLink>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="hidden 2xl:block 2xl:bg-neutral-950 2xl:capitalize 2xl:text-white 3xl:hidden"
        >
          {item.label}
        </TooltipContent>
      </Tooltip>
    </li>
  );
}
