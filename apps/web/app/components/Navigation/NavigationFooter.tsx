import { NavLink, useLocation } from "@remix-run/react";
import { capitalize } from "lodash-es";
import { type Dispatch, type SetStateAction, startTransition } from "react";
import { useTranslation } from "react-i18next";

import { useLogoutUser } from "~/api/mutations";
import { Gravatar } from "~/components/Gravatar";
import { Icon } from "~/components/Icon";
import { Avatar } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { useCurrentUserStore } from "~/modules/common/store/useCurrentUserStore";

type NavigationFooterProps = {
  isAdmin: boolean;
  isTeacher: boolean;
  role: string;
  setIsMobileNavOpen: Dispatch<SetStateAction<boolean>>;
};

export function NavigationFooter({
  isAdmin,
  isTeacher,
  role,
  setIsMobileNavOpen,
}: NavigationFooterProps) {
  const { currentUser } = useCurrentUserStore();
  const { mutate: logout } = useLogoutUser();
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");

  const { t } = useTranslation();
  const isAllowed = isAdmin || isTeacher;

  return (
    <menu className="grid w-full grid-cols-2 gap-2 md:grid-cols-6 md:gap-4 2xl:flex 2xl:flex-col 2xl:gap-2 2xl:self-end">
      <li className="col-span-2 md:col-span-6 2xl:hidden">
        <Separator className="3xl:my-2 bg-primary-200 2xl:h-[1px]" />
      </li>
      {isAllowed && (
        <li className="col-span-2 md:col-span-3">
          <Tooltip>
            <TooltipTrigger className="w-full">
              <NavLink
                onClick={() => setIsMobileNavOpen(false)}
                className="flex w-full items-center gap-x-3 rounded-lg bg-white px-4 py-3.5 text-neutral-900 2xl:p-2"
                to={isAdminRoute ? "/" : "/admin/courses"}
              >
                <Icon name={isAdminRoute ? "Dashboard" : "Admin"} className="size-6 pl-[2px]" />
                <span className="3xl:not-sr-only 2xl:sr-only">
                  {isAdminRoute ? (
                    "Dashboard"
                  ) : (
                    <>
                      {capitalize(role)} {t("navigationSideBar.panel")}
                    </>
                  )}{" "}
                </span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="3xl:hidden hidden 2xl:block 2xl:bg-neutral-950 2xl:capitalize 2xl:text-white"
            >
              {isAdminRoute ? (
                "Dashboard"
              ) : (
                <>
                  {capitalize(role)} {t("navigationSideBar.panel")}
                </>
              )}
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
                cn("flex w-full items-center gap-x-3 rounded-lg px-4 py-3.5 2xl:p-2", {
                  "bg-primary-700 text-white": isActive,
                  "bg-white text-neutral-900": !isActive,
                })
              }
            >
              <Icon name="Settings" className="size-6" />
              <span className="3xl:not-sr-only 2xl:sr-only">{t("navigationSideBar.settings")}</span>
            </NavLink>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="3xl:hidden hidden 2xl:block 2xl:bg-neutral-950 2xl:capitalize 2xl:text-white"
          >
            {t("navigationSideBar.settings")}
          </TooltipContent>
        </Tooltip>
      </li>
      <li className={cn("md:col-span-3", { "sr-only": isAdminRoute || !isAllowed })}>
        <NavLink
          onClick={() => setIsMobileNavOpen(false)}
          to={`/teachers/${currentUser?.id}`}
          className={({ isActive }) =>
            cn("flex w-full items-center gap-x-3 rounded-lg px-4 py-3.5 2xl:p-2", {
              "bg-primary-700 text-white": isActive,
              "bg-white text-neutral-900": !isActive,
            })
          }
        >
          <Icon name="User" className="size-6" />
          <span className="3xl:not-sr-only 2xl:sr-only">{t("navigationSideBar.profile")}</span>
        </NavLink>
      </li>
      <li className="sr-only 2xl:not-sr-only">
        <div className="3xl:gap-x-2 3xl:flex-row 3xl:p-3 3xl:mt-4 flex flex-col items-center justify-center rounded-lg bg-neutral-50 px-1 py-4">
          <Avatar className="3xl:size-10 size-8">
            <Gravatar email={currentUser?.email} size={32} />
          </Avatar>
          <hgroup className="3xl:not-sr-only sr-only flex flex-col justify-center">
            <h2 className="body-sm-md text-neutral-950">
              {currentUser?.firstName} {currentUser?.lastName}
            </h2>
            <p className="details text-neutral-600">{currentUser?.email}</p>
          </hgroup>
        </div>
      </li>
      <li className="hidden 2xl:block">
        <Separator className="bg-primary-200 2xl:h-[1px]" />
      </li>
      <li
        className={cn({
          "col-span-1 md:col-span-6": isAllowed && isAdminRoute,
          "col-span-2 md:col-span-3": isAllowed && !isAdminRoute,
          "col-span-2 md:col-span-6": !isAllowed,
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
              className="flex w-full items-center gap-x-3 rounded-lg bg-white px-4 py-3.5 text-neutral-900 2xl:p-2"
            >
              <Icon name="Logout" className="size-6" />
              <span className="3xl:not-sr-only 2xl:sr-only">{t("navigationSideBar.logout")}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="3xl:hidden hidden 2xl:block 2xl:bg-neutral-950 2xl:capitalize 2xl:text-white"
          >
            {t("navigationSideBar.logout")}
          </TooltipContent>
        </Tooltip>
      </li>
    </menu>
  );
}
