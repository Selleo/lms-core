import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CourseFormState, CourseFormStore } from "../types/scorm.types";

const initialState: CourseFormState = {
  currentStep: 0,
  formData: {
    scorm: { file: null },
    details: {
      title: "",
      category: "",
      description: "",
      thumbnail: null,
    },
    pricing: { type: "free", price: undefined, currency: "PLN" },
    status: "draft",
  },
};

export const useScormFormStore = create<CourseFormStore>()(
  persist(
    (set) => ({
      ...initialState,
      setCurrentStep: (step) => set({ currentStep: step }),
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetForm: () => set(initialState),
    }),
    {
      name: "scorm-form-storage",
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: {
          ...state.formData,
          scorm: {
            fileMetadata: state.formData.scorm?.file
              ? {
                  name: state.formData.scorm.file.name,
                  size: state.formData.scorm.file.size,
                  type: state.formData.scorm.file.type,
                }
              : undefined,
          },
          details: {
            ...state.formData.details,
            thumbnail: null,
          },
        },
      }),
    },
  ),
);
