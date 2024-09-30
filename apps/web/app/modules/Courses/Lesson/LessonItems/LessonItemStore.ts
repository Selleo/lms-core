import { create } from "zustand";
import { persist } from "zustand/middleware";

type CompletedPresentationsStore = {
  completedLessonItems: string[];
  markLessonItemAsCompleted: (presentationId: string) => void;
  isLessonItemCompleted: (presentationId: string) => boolean;
};

export const useCompletedPresentationsStore =
  create<CompletedPresentationsStore>()(
    persist(
      (set, get) => ({
        completedLessonItems: [],
        markLessonItemAsCompleted: (presentationId: string) =>
          set((state) => ({
            completedLessonItems: [
              ...state.completedLessonItems,
              presentationId,
            ],
          })),
        isLessonItemCompleted: (presentationId: string) => {
          return (
            Array.isArray(get().completedLessonItems) &&
            get().completedLessonItems.includes(presentationId)
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
                  "Rehydrated completedPresentations is not an array, resetting to empty array"
                );
                rehydratedState.completedLessonItems = [];
              }
            }
          };
        },
      }
    )
  );
