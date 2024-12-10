import { createContext, useContext } from "react";

import type { StepperContextType } from "./types";

export const StepperContext = createContext<StepperContextType | null>(null);

export const useStepperContext = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepperContext must be used within StepperProvider");
  }
  return context;
};
