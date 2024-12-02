import { useEffect, useState } from "react";

export function useMobileNavigation(initialState = false, breakpoint = 1440) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(initialState);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= breakpoint) {
        setIsMobileNavOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return { isMobileNavOpen, setIsMobileNavOpen };
}
