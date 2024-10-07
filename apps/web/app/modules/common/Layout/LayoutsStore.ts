import { create } from "zustand";
import { persist } from "zustand/middleware";

type TLayoutsStore = {
  courseListLayout: "table" | "card";
  setCourseListLayout: (layout: "table" | "card") => void;
};

export const useLayoutsStore = create<TLayoutsStore>()(
  persist(
    (set) => ({
      courseListLayout: "card",
      setCourseListLayout: (layout) => set({ courseListLayout: layout }),
    }),
    {
      name: "layouts-storage",
      partialize: (state) => ({
        courseListLayout: state.courseListLayout,
      }),
    }
  )
);
