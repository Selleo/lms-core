import { Separator } from "~/components/ui/separator";
import { TooltipProvider } from "~/components/ui/tooltip";
import { useUserRole } from "~/hooks/useUserRole";
import { cn } from "~/lib/utils";

import { NavigationFooter } from "./NavigationFooter";
import { NavigationHeader } from "./NavigationHeader";
import { NavigationMenu } from "./NavigationMenu";
import { useMobileNavigation } from "./useMobileNavigation";

import type { MenuItemType } from "~/config/navigationConfig";

type DashboardNavigationProps = { menuItems: MenuItemType[] };

export function Navigation({ menuItems }: DashboardNavigationProps) {
  const { isMobileNavOpen, setIsMobileNavOpen } = useMobileNavigation();
  const { isAdmin, isTutor, role } = useUserRole();

  return (
    <header className="sticky top-0 w-full z-10 h-min 2xl:static 2xl:py-4 2xl:px-2 2xl:w-14 3xl:w-60 2xl:h-dvh 2xl:flex 2xl:flex-col 2xl:gap-y-6 3xl:p-4">
      <NavigationHeader isMobileNavOpen={isMobileNavOpen} setIsMobileNavOpen={setIsMobileNavOpen} />
      <Separator className="sr-only 2xl:not-sr-only 2xl:h-[1px] bg-primary-200" />
      <nav
        className={cn("2xl:flex 2xl:flex-col 2xl:justify-between 2xl:h-full", {
          "pt-7 pb-4 px-4 flex flex-col bg-primary-50 gap-y-3 h-[calc(100dvh-4rem)] justify-between 2xl:p-0 2xl:bg-transparent":
            isMobileNavOpen,
          "sr-only 2xl:not-sr-only": !isMobileNavOpen,
        })}
      >
        <TooltipProvider>
          <NavigationMenu
            menuItems={menuItems}
            role={role}
            setIsMobileNavOpen={setIsMobileNavOpen}
          />
          <NavigationFooter
            role={role}
            isAdmin={isAdmin}
            isTutor={isTutor}
            setIsMobileNavOpen={setIsMobileNavOpen}
          />
        </TooltipProvider>
      </nav>
    </header>
  );
}
