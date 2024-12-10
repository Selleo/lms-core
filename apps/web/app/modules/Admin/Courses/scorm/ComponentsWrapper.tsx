import { Progress } from "~/components/Stepper/Progress";
import { StepHeader } from "~/components/Stepper/StepHeader";
import { useStepperContext } from "~/components/Stepper/StepperContext";

import type { ReactNode } from "react";

interface WrapperProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
}

export const ComponentsWrapper = ({ leftContent, rightContent }: WrapperProps) => {
  const { currentStep, totalSteps, currentTitle, currentDescription } = useStepperContext();

  return (
    <div className="w-full h-full p-20">
      <div className="flex h-full gap-[120px]">
        <div className="flex-1 h-full">
          <StepHeader title={currentTitle} description={currentDescription} />
          <Progress currentStep={currentStep} totalSteps={totalSteps} />
          <div className="mt-8">{leftContent}</div>
        </div>
        <div className="flex-1 h-full">{rightContent}</div>
      </div>
    </div>
  );
};
