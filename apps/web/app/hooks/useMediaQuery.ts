import { useEffect, useState } from "react";

import { toMediaQuery } from "~/utils/toMediaQuery";

import type { ToMediaQueryObjectParam } from "~/types/shared";

export const useMediaQuery = (param: string | ToMediaQueryObjectParam) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = toMediaQuery(param);
    const media = window.matchMedia(query);

    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => {
      setMatches(media.matches);
    };

    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, param]);

  return matches;
};
