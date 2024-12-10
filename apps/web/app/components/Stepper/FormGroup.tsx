import { useStepperContext } from "./StepperContext";

import type { FormGroupProps } from "./types";

export const FormGroup = ({ children, startStep, endStep }: FormGroupProps) => {
  const { currentStep } = useStepperContext();
  const isActive = currentStep >= startStep && currentStep <= endStep;

  if (!isActive) return null;

  return <div className="w-full">{children}</div>;
};
