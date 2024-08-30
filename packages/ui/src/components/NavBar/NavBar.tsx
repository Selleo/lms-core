import { LucideProps } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { MenuItem } from "./MenuItem.js";

interface MenuItemChildren {
  id: string | number;
  name: string;
  href: string;
}

export interface MenuItems {
  id: string | number;
  name: string;
  href: string;
  Icon: React.FC<LucideProps>;
  children?: MenuItemChildren[];
}

interface NavBarProps {
  menuItems: MenuItems[];
  isVisible: boolean;
  isNarrowWindow: boolean;
}

export function NavBar({ menuItems, isVisible, isNarrowWindow }: NavBarProps) {
  if (!menuItems?.length) {
    return null;
  }
  const wrapperClasses = cn("top-0 left-0 w-fit h-full bg-white shadow-md", {
    relative: !isNarrowWindow,
    "absolute transform transition-transform duration-300 translate-x-0 z-50":
      isNarrowWindow && isVisible,
    "absolute transform transition-transform duration-300 -translate-x-full":
      isNarrowWindow && !isVisible,
  });

  return (
    <div className={wrapperClasses}>
      <div
        className={
          "w-52 h-full bg-muted/40 overflow-y-auto overflow-x-hidden flex flex-col"
        }
      >
        <nav className="flex-grow mt-20 text-base">
          <span className="block py-2 font-medium text-gray-600 capitalize pl-5">
            Management
          </span>
          <ul className="flex flex-col">
            {menuItems.map((item) => (
              <MenuItem key={item.id} {...item} />
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
