import { Link } from "@remix-run/react";

import { Icon } from "~/components/Icon";
import { MobileMenuToggle } from "~/components/Navigation/MobileMenuToggle";

import type { Dispatch, SetStateAction } from "react";

type NavigationHeaderProps = {
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: Dispatch<SetStateAction<boolean>>;
};

export function NavigationHeader({ isMobileNavOpen, setIsMobileNavOpen }: NavigationHeaderProps) {
  return (
    <div className="flex w-full justify-between py-3 px-4 2xl:p-0 2xl:justify-center 2xl:h-20 2xl:items-center">
      <Link to="/" aria-label="Go to homepage">
        <Icon name="SelleoLogo" className="h-10 w-full 2xl:sr-only 3xl:not-sr-only 3xl:h-12" />
        <Icon name="SelleoSignet" className="sr-only 2xl:not-sr-only 3xl:sr-only" />
      </Link>
      <MobileMenuToggle isMobileNavOpen={isMobileNavOpen} setIsMobileNavOpen={setIsMobileNavOpen} />
    </div>
  );
}
