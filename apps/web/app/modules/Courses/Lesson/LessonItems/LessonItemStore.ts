import { create } from "zustand";
import { persist } from "zustand/middleware";
import { lessonQueryOptions } from "~/api/queries/useLesson";
import { queryClient } from "~/api/queryClient";

type TMarkLessonItemAsCompletedOptions = {
  lessonItemId: string;
  lessonId: string;
};

type TCompletedLessonItemsStore = {
  completedLessonItems: string[];
  markLessonItemAsCompleted: ({
    lessonItemId,
    lessonId,
  }: TMarkLessonItemAsCompletedOptions) => Promise<void>;
  isLessonItemCompleted: (lessonItemId: string) => boolean;
};

export const useCompletedLessonItemsStore =
  create<TCompletedLessonItemsStore>()(
    persist(
      (set, get) => ({
        completedLessonItems: [],
        markLessonItemAsCompleted: async ({
          lessonItemId,
          lessonId,
        }: TMarkLessonItemAsCompletedOptions) => {
          await queryClient.invalidateQueries(lessonQueryOptions(lessonId));

          return set((state) => ({
            completedLessonItems: [...state.completedLessonItems, lessonItemId],
          }));
        },
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
                  "Rehydrated completedLessonItems is not an array, resetting to empty array",
                );
                rehydratedState.completedLessonItems = [];
              }
            }
          };
        },
      },
    ),
  );
