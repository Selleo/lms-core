import { useStepperContext } from "./StepperContext";

import type { StepProps } from "./types";

export const Step = ({ children, stepId }: StepProps) => {
  const { currentStep } = useStepperContext();
  const isActive = currentStep === stepId;

  if (!isActive) return null;

  return <div className="w-full">{children}</div>;
};
