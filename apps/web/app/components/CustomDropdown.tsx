import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu.js";
import { Button } from "~/components/ui/button.js";
import chevronDown from "public/chevron-down.svg";
import { Link } from "@remix-run/react";
import { useThemeStore } from "~/modules/Theme/themeStore";
import { ReactSVG } from "react-svg";

interface DropdownItem {
  label: string | React.ReactElement;
  onClick?: () => void;
  href?: string;
}

interface CustomDropdownProps {
  items: DropdownItem[];
  buttonText: string;
  buttonIcon?: string;
  buttonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  items,
  buttonText,
  buttonIcon = chevronDown,
  buttonVariant = "outline",
}) => {
  const { theme } = useThemeStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={buttonVariant}>
          {buttonText}
          {buttonIcon && (
            <p
              className={`flex justify-center items-center w-7 h-full ml-2 pl-2 border-l ${theme === "light" ? "border-zinc-100" : "border-zinc-600"}	`}
            >
              <ReactSVG className="w-4 h-4" src={buttonIcon} />
            </p>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {React.isValidElement(item.label) &&
            (item.label as React.ReactElement).type === DropdownMenuItem ? (
              item.label
            ) : item.href ? (
              <DropdownMenuItem asChild>
                <Link
                  to={item.href}
                  className="cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={item.onClick}
                className="cursor-pointer"
              >
                {item.label}
              </DropdownMenuItem>
            )}
            {index < items.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
