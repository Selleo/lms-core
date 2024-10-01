import { create } from "zustand";
import { persist } from "zustand/middleware";

type TCompletedLessonItemsStore = {
  completedLessonItems: string[];
  markLessonItemAsCompleted: (lessonItemId: string) => void;
  isLessonItemCompleted: (lessonItemId: string) => boolean;
};

export const useCompletedLessonItemsStore =
  create<TCompletedLessonItemsStore>()(
    persist(
      (set, get) => ({
        completedLessonItems: [],
        markLessonItemAsCompleted: (lessonItemId: string) =>
          set((state) => ({
            completedLessonItems: [...state.completedLessonItems, lessonItemId],
          })),
        isLessonItemCompleted: (lessonItemId: string) => {
          return (
            Array.isArray(get().completedLessonItems) &&
            get().completedLessonItems.includes(lessonItemId)
          );
        },
      }),
      {
        name: "completed-lesson-items-storage",
        partialize: (state) => ({
          completedLessonItems: state.completedLessonItems,
        }),
        onRehydrateStorage: () => {
          return (rehydratedState, error) => {
            if (error) {
              console.error("Error rehydrating state:", error);
            } else if (rehydratedState) {
              if (!Array.isArray(rehydratedState.completedLessonItems)) {
                console.warn(
                  "Rehydrated completedLessonItems is not an array, resetting to empty array"
                );
                rehydratedState.completedLessonItems = [];
              }
            }
          };
        },
      }
    )
  );
