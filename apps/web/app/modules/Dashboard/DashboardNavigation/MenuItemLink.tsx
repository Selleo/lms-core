import { NavLink } from "@remix-run/react";
import { cn } from "~/lib/utils";
import { memo } from "react";
import type { LeafMenuItem } from "./DashboardNavigation";

export const MenuItemLink = memo(({ label, link, Icon }: LeafMenuItem) => (
  <NavLink
    to={link}
    className={({ isActive }) =>
      cn(
        "w-full h-full flex items-center p-5 relative transition-colors duration-300",
        {
          "bg-primary text-primary-foreground font-medium": isActive,
          "text-muted-foreground hover:bg-link-hover": !isActive,
        }
      )
    }
    end={link === "/"}
  >
    {({ isActive }) => (
      <>
        <Icon
          className={cn("w-5 h-5 mr-2", {
            "text-primary-foreground": isActive,
          })}
        />
        <span className="capitalize">{label}</span>
        {isActive && (
          <span className="absolute inset-y-0 left-0 w-1 bg-secondary" />
        )}
      </>
    )}
  </NavLink>
));
