import { Icon } from "~/components/Icon";
import { cn } from "~/lib/utils";

import type { STEPS } from "../constants/scorm.consts";

interface ProgressProps {
  currentStep: number;
  steps: typeof STEPS;
}

export const Progress = ({ currentStep, steps }: ProgressProps) => {
  return (
    <div className="w-full flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const state = (() => {
          if (currentStep === index) return "current";
          if (currentStep > index) return "previous";
          return "upcoming";
        })();

        const isLastStep = index === steps.length - 1;

        return (
          <div key={step.id} className={cn("flex items-center", !isLastStep && "flex-1")}>
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out bg-primary-50 relative",
                {
                  "bg-secondary-50": state === "current",
                  "bg-success-50": state === "previous",
                },
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0",
                  {
                    "opacity-100": state === "current",
                  },
                )}
              >
                <Icon name="InProgress" className="w-6 h-6" />
              </div>

              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0",
                  {
                    "opacity-100": state === "previous",
                  },
                )}
              >
                <div className="text-success-600 border-2 border-success-600 rounded-full p-px w-6 h-6">
                  <Icon name="Checkmark" />
                </div>
              </div>

              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-300 opacity-0",
                  {
                    "opacity-100": state === "upcoming",
                  },
                )}
              >
                <span className="text-sm font-medium text-primary-700">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </div>

            {!isLastStep && (
              <div className="flex-1 mx-4">
                <div className="h-1 rounded-full bg-primary-100">
                  <div
                    className={cn(
                      "h-full bg-success-200 transition-all duration-500 ease-in-out rounded-full",
                      {
                        "w-full": currentStep > index,
                        "w-0": currentStep <= index,
                      },
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
