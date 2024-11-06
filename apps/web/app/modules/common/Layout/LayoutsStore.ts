import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CourseListLayout } from "~/types/shared";

interface ILayoutsStore {
  courseListLayout: CourseListLayout;
  setCourseListLayout: (layout: this["courseListLayout"]) => void;
}

export const useLayoutsStore = create<ILayoutsStore>()(
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
    },
  ),
);
