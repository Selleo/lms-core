import { create } from "zustand";

type LandingStore = {
  isSheetOpen: boolean;
  setIsSheetOpen: (isSheetOpen: boolean) => void;
};

export const useLandingStore = create<LandingStore>((set) => ({
  isSheetOpen: false,
  setIsSheetOpen: (isSheetOpen) => set({ isSheetOpen }),
}));
