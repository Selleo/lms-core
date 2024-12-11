import { useMemo } from "react";

import { cn } from "~/lib/utils";

import { FormGroup } from "./FormGroup";
import { Step } from "./Step";
import { StepperContext } from "./StepperContext";

import type { StepperProps, StepConfig, FormGroupConfig } from "./types";

const Stepper = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  children,
  className = "",
  steps,
}: StepperProps) => {
  const currentStepInfo = useMemo(() => {
    const currentConfig = steps.find((config) => {
      if ("steps" in config) {
        const formGroup = config as FormGroupConfig;
        return currentStep >= formGroup.startStep && currentStep <= formGroup.endStep;
      }
      const step = config as StepConfig;
      return step.stepId === currentStep;
    });

    if (!currentConfig) return {};

    if ("steps" in currentConfig) {
      const formGroup = currentConfig as FormGroupConfig;
      const step = formGroup.steps.find((singleStep) => singleStep.stepId === currentStep);
      return {
        currentTitle: step?.title,
        currentDescription: step?.description,
      };
    }

    const step = currentConfig as StepConfig;
    return {
      currentTitle: step.title,
      currentDescription: step.description,
    };
  }, [currentStep, steps]);

  return (
    <StepperContext.Provider
      value={{
        currentStep,
        totalSteps,
        onNext,
        onPrev,
        ...currentStepInfo,
      }}
    >
      <div className={cn("w-full", className)}>{children}</div>
    </StepperContext.Provider>
  );
};

Stepper.Step = Step;
Stepper.FormGroup = FormGroup;

export default Stepper;
