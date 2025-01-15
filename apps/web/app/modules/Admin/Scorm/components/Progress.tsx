import { Icon } from "~/components/Icon";
import { cn } from "~/lib/utils";

import type { SCORM_CONFIG } from "../scorm.config";

interface ProgressProps {
  currentStep: number;
  steps: typeof SCORM_CONFIG;
}

export const Progress = ({ currentStep, steps }: ProgressProps) => {
  return (
    <div className="mb-8 flex w-full items-center justify-between">
      {steps.map((step, index) => {
        const state = (() => {
          if (currentStep === index) return "current";
          if (currentStep > index) return "previous";
          return "upcoming";
        })();

        const isLastStep = index === steps.length - 1;

        return (
          <div key={step.id} className={cn("flex items-center", { "flex-1": !isLastStep })}>
            <div
              className={cn(
                "bg-primary-50 relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ease-in-out",
                {
                  "bg-secondary-50": state === "current",
                  "bg-success-50": state === "previous",
                },
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300",
                  {
                    "opacity-100": state === "current",
                  },
                )}
              >
                <Icon name="InProgress" className="h-6 w-6" />
              </div>

              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300",
                  {
                    "opacity-100": state === "previous",
                  },
                )}
              >
                <div className="text-success-600 border-success-600 h-6 w-6 rounded-full border-2 p-px">
                  <Icon name="Checkmark" />
                </div>
              </div>

              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300",
                  {
                    "opacity-100": state === "upcoming",
                  },
                )}
              >
                <span className="text-primary-700 text-sm font-medium">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </div>

            {!isLastStep && (
              <div className="mx-4 flex-1">
                <div className="bg-primary-100 h-1 rounded-full">
                  <div
                    className={cn(
                      "bg-success-200 h-full rounded-full transition-all duration-500 ease-in-out",
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
