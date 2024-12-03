import { NavLink, useLocation } from "@remix-run/react";
import { capitalize } from "lodash-es";
import { type Dispatch, type SetStateAction, startTransition } from "react";

import { useLogoutUser } from "~/api/mutations";
import { useCurrentUser } from "~/api/queries";
import { Gravatar } from "~/components/Gravatar";
import { Icon } from "~/components/Icon";
import { Avatar } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

type NavigationFooterProps = {
  isAdmin: boolean;
  isTutor: boolean;
  role: string;
  setIsMobileNavOpen: Dispatch<SetStateAction<boolean>>;
};

export function NavigationFooter({
  isAdmin,
  isTutor,
  role,
  setIsMobileNavOpen,
}: NavigationFooterProps) {
  const { data: user } = useCurrentUser();
  const { mutate: logout } = useLogoutUser();
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");

  const isAllowed = isAdmin || isTutor;

  return (
    <menu className="grid grid-cols-2 gap-2 md:gap-4 2xl:gap-2 md:grid-cols-6 w-full 2xl:flex 2xl:flex-col 2xl:self-end">
      <li className="2xl:hidden col-span-2 md:col-span-6">
        <Separator className="3xl:my-2 2xl:h-[1px] bg-primary-200" />
      </li>
      {isAllowed && (
        <li className="col-span-2 md:col-span-3">
          <Tooltip>
            <TooltipTrigger className="w-full">
              <NavLink
                onClick={() => setIsMobileNavOpen(false)}
                className="flex gap-x-3 items-center py-3.5 px-4 rounded-lg w-full 2xl:p-2 bg-white text-neutral-900"
                to={isAdminRoute ? "/" : "/admin/courses"}
              >
                <Icon name={isAdminRoute ? "Dashboard" : "Admin"} className="size-6 pl-[2px]" />
                <span className="2xl:sr-only 3xl:not-sr-only">
                  {isAdminRoute ? "Dashboard" : <>{capitalize(role)} panel</>}{" "}
                </span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="hidden 2xl:block 2xl:capitalize 3xl:hidden 2xl:bg-neutral-950 2xl:text-white"
            >
              {isAdminRoute ? "Dashboard" : <>{capitalize(role)} panel</>}
            </TooltipContent>
          </Tooltip>
        </li>
      )}
      <li className={cn("md:col-span-3", { hidden: isAllowed && isAdminRoute })}>
        <Tooltip>
          <TooltipTrigger className="w-full">
            <NavLink
              onClick={() => setIsMobileNavOpen(false)}
              to="/settings"
              className={({ isActive }) =>
                cn("flex gap-x-3 items-center py-3.5 px-4 rounded-lg w-full 2xl:p-2", {
                  "bg-primary-700 text-white": isActive,
                  "bg-white text-neutral-900": !isActive,
                })
              }
            >
              <Icon name="Settings" className="size-6" />
              <span className="2xl:sr-only 3xl:not-sr-only">Settings</span>
            </NavLink>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="hidden 2xl:block 2xl:capitalize 3xl:hidden 2xl:bg-neutral-950 2xl:text-white"
          >
            Settings
          </TooltipContent>
        </Tooltip>
      </li>
      <li className={cn("md:col-span-3", { "sr-only": isAdminRoute || !isAllowed })}>
        <NavLink
          onClick={() => setIsMobileNavOpen(false)}
          to={`/teachers/${user?.id}`}
          className={({ isActive }) =>
            cn("flex gap-x-3 items-center py-3.5 px-4 rounded-lg w-full 2xl:p-2", {
              "bg-primary-700 text-white": isActive,
              "bg-white text-neutral-900": !isActive,
            })
          }
        >
          <Icon name="User" className="size-6" />
          <span className="2xl:sr-only 3xl:not-sr-only">Profile</span>
        </NavLink>
      </li>
      <li className="sr-only 2xl:not-sr-only">
        <div className="flex flex-col items-center 3xl:gap-x-2 justify-center 3xl:flex-row rounded-lg px-1 py-4 bg-neutral-50 3xl:p-3 3xl:mt-4">
          <Avatar className="size-8 3xl:size-10">
            <Gravatar email={user?.email} size={32} />
          </Avatar>
          <hgroup className="flex flex-col justify-center sr-only 3xl:not-sr-only">
            <h2 className="text-neutral-950 body-sm-md">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="details text-neutral-600">{user?.email}</p>
          </hgroup>
        </div>
      </li>
      <li className="hidden 2xl:block">
        <Separator className="2xl:h-[1px] bg-primary-200" />
      </li>
      <li
        className={cn({
          "md:col-span-6 col-span-1": isAllowed && isAdminRoute,
          "md:col-span-3 col-span-2": isAllowed && !isAdminRoute,
          "md:col-span-6 col-span-2": !isAllowed,
        })}
      >
        <Tooltip>
          <TooltipTrigger className="w-full">
            <button
              onClick={() => {
                startTransition(() => {
                  logout();
                });
              }}
              className="flex gap-x-3 items-center py-3.5 px-4 rounded-lg w-full 2xl:p-2 bg-white text-neutral-900"
            >
              <Icon name="Logout" className="size-6" />
              <span className="2xl:sr-only 3xl:not-sr-only">Logout</span>
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="hidden 2xl:block 2xl:capitalize 3xl:hidden 2xl:bg-neutral-950 2xl:text-white"
          >
            Logout
          </TooltipContent>
        </Tooltip>
      </li>
    </menu>
  );
}
