import { NavLink } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { memo } from "react";
import type { LeafMenuItem } from "./DashboardNavigation";
import { Icon } from "~/components/Icon";

export const MenuItemLink = memo(({ label, link, iconName }: LeafMenuItem) => (
  <NavLink
    to={link}
    className={({ isActive }) =>
      cn(
        "w-full h-full p-2 [&:not(:first-child)]:mt-3 flex items-center relative rounded-md transition-colors duration-300 text-neutral-900",
        {
          "bg-primary-700 text-white": isActive,
          "hover:bg-primary-50": !isActive,
        },
      )
    }
    end={link === "/"}
  >
    <>
      <Icon name={iconName} className="w-4 h-4 mr-2" />
      <span className="capitalize subtle text-md">
        {label}
      </span>
    </>
  </NavLink>
));
