import { useEffect, useState } from "react";

export const useTrackDataUpdatedAt = (dataUpdatedAt: number) => {
  const [previousDataUpdatedAt, setPreviousDataUpdatedAt] = useState<number | null>(null);

  useEffect(() => {
    if (dataUpdatedAt && !previousDataUpdatedAt) {
      setPreviousDataUpdatedAt(dataUpdatedAt);
    } else if (dataUpdatedAt && previousDataUpdatedAt && dataUpdatedAt !== previousDataUpdatedAt) {
      setPreviousDataUpdatedAt(dataUpdatedAt);
    }
  }, [dataUpdatedAt, previousDataUpdatedAt]);

  return { previousDataUpdatedAt, currentDataUpdatedAt: dataUpdatedAt };
};
