import { memo, useState } from "react";
import type { MenuItems } from "./NavBar.js";
import { NavLink } from "react-router-dom";

import { SubMenu } from "./SubMenu.js";
import { DropdownToggle } from "./DropdownToggle.js";
import { cn } from "@/src/lib/utils.js";

export const MenuItem = memo(({ name, href, Icon, children }: MenuItems) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  if (!href) return null;

  return (
    <li className="h-14 w-full relative">
      <NavLink
        to={href}
        className={({ isActive }) =>
          cn(
            "no-underline w-full h-full flex items-center relative pl-5 transition-colors duration-300",
            {
              "bg-primary text-primary-foreground font-medium": isActive,
              "text-muted-foreground hover:bg-link-hover": !isActive,
            }
          )
        }
        end={href === "/"}
      >
        {({ isActive }) => (
          <>
            <Icon
              className={cn("w-5 h-5 mr-2", {
                "text-primary-foreground": isActive,
              })}
            />
            <span className="capitalize">{name}</span>
            {children && (
              <DropdownToggle isOpen={isOpen} toggleDropdown={toggleDropdown} />
            )}
            {isActive && (
              <span className="absolute inset-y-0 left-0 w-1 bg-secondary" />
            )}
          </>
        )}
      </NavLink>
      {isOpen && children && <SubMenu children={children} />}
    </li>
  );
});
