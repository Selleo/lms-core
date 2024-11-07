import { useLocation, useNavigate } from "@remix-run/react";
import { cx } from "class-variance-authority";
import { capitalize } from "lodash-es";
import { ArrowRight } from "lucide-react";
import { Suspense, useState } from "react";

import { SelleoLogo } from "~/assets/svgs";
import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { useUserRole } from "~/hooks/useUserRole";
import Loader from "~/modules/common/Loader/Loader";
import { MenuItem } from "~/modules/Dashboard/DashboardNavigation/MenuItem";

import { LogoutButton } from "./LogoutButton";
import { UserProfile } from "./UserProfile";

import type { MenuItemType } from "~/config/navigationConfig";
import type { UserRole } from "~/config/userRoles";

export function DashboardNavigation({ menuItems }: { menuItems: MenuItemType[] }) {
  const { isAdmin, isTutor, role } = useUserRole();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isAdminRoute = pathname.startsWith("/admin");

  const isAllowed = isAdmin || isTutor;

  const filteredMenuItems = menuItems.filter(
    (item) => item.roles && item.roles.includes(role as UserRole),
  );

  return (
    <>
      <button
        aria-label="Open sidebar"
        className={cx(
          "fixed top-6 lg:sr-only right-6 bg-white z-10 drop-shadow rounded-lg p-2 grid place-items-center",
          {
            "sr-only": isOpen,
          },
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Icon name="HamburgerMenu" className="w-6 h-6" />
      </button>
      <aside
        className={cx(
          "w-[240px] bg-muted/40 fixed lg:static top-0 right-0 z-10 h-dvh flex flex-col gap-4 bg-white p-4 drop-shadow-primary duration-300",
          {
            "translate-x-full lg:translate-x-0": !isOpen,
            "translate-x-0 lg:translate-x-0": isOpen,
          },
        )}
      >
        <div className="lg:sr-only">
          <button
            className="rotate-180"
            aria-label="Close sidebar"
            onClick={() => setIsOpen(false)}
          >
            <Icon name="HamburgerMenuClose" className="w-6 h-6" />
          </button>
        </div>
        <div className="pt-4 pb-8 lg:py-8 w-full flex justify-center border-b-primary-200 border-b">
          <SelleoLogo />
        </div>

        <div className="flex flex-col h-full">
          <nav>
            <ul className="flex flex-col items-center">
              {filteredMenuItems.map((item) => (
                <MenuItem key={item.label} item={item} />
              ))}
            </ul>
          </nav>
        </div>
        <Suspense fallback={<Loader />}>
          <UserProfile />
        </Suspense>
        <div className="flex items-center border-t border-t-primary-200 w-full pt-4 gap-2 flex-col">
          {isAllowed && (
            <Button
              className="w-full justify-start gap-2"
              variant="outline"
              onClick={() => navigate(isAdminRoute ? "/" : "/admin/courses")}
            >
              {`Go to ${isAdminRoute ? "Dashboard" : capitalize(role)}`}
              <ArrowRight className="w-4 h-4 inline-block text-primary-700" />
            </Button>
          )}
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
