import { useRef, useEffect } from "react";

export const useIsMount = () => {
  const isMountedRef = useRef(false);
  useEffect(() => {
    isMountedRef.current = true;
  }, []);
  return isMountedRef.current;
};
