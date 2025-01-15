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
    <div className="flex w-full justify-between px-4 py-3 2xl:h-20 2xl:items-center 2xl:justify-center 2xl:p-0">
      <Link to="/" aria-label="Go to homepage">
        <Icon name="SelleoLogo" className="3xl:not-sr-only 3xl:h-12 h-10 w-full 2xl:sr-only" />
        <Icon name="SelleoSignet" className="3xl:sr-only sr-only 2xl:not-sr-only" />
      </Link>
      <MobileMenuToggle isMobileNavOpen={isMobileNavOpen} setIsMobileNavOpen={setIsMobileNavOpen} />
    </div>
  );
}
