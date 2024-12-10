import { cn } from "~/lib/utils";

import { Icon } from "../Icon";

interface ProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const Progress = ({ currentStep, totalSteps }: ProgressProps) => {
  const steps = Array.from({ length: totalSteps }, (_, index) => index);

  return (
    <div className="w-full flex items-center justify-between mb-8">
      {steps.map((index) => {
        const state = (() => {
          if (currentStep === index + 1) return "current";
          if (currentStep > index + 1) return "previous";
          return "upcoming";
        })();

        const isLastStep = index === totalSteps - 1;

        return (
          <div key={index} className="flex items-center">
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
              <div className="mx-4 w-12 h-1 rounded-full bg-primary-100">
                <div
                  className={cn(
                    "h-full bg-success-200 transition-all duration-500 ease-in-out rounded-full",
                    {
                      "w-full": currentStep > index + 1,
                      "w-0": currentStep <= index + 1,
                    },
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
