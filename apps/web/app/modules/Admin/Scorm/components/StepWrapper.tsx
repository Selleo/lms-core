import { STEPS } from "../constants/scorm.consts";
import { useScormFormStore } from "../store/scormForm.store";

import { Progress } from "./Progress";

import type { PropsWithChildren } from "react";

interface StepWrapperProps {
  title: string;
  description: string;
}

export function StepWrapper({ title, description, children }: PropsWithChildren<StepWrapperProps>) {
  const { currentStep } = useScormFormStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Progress currentStep={currentStep} steps={STEPS} />

      {children}
    </div>
  );
}
