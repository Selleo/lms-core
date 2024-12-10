import React, { useMemo } from "react";

export const MultiStep = ({
  currentStep = 1,
  steps = ["Upload SCORM", "Basic Settings", "Advanced", "Final"],
  className = "",
}) => {
  const percentage = useMemo(() => {
    return ((currentStep - 1) / (steps.length - 1)) * 100;
  }, [currentStep, steps.length]);

  return (
    <div className={`w-full ${className}`}>
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep > index;
          const isCurrent = currentStep === index + 1;

          return (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  transition-all duration-300 ease-in-out
                  ${isActive || isCurrent ? "bg-blue-500 border-blue-500" : "bg-white border-gray-300"}
                  ${isCurrent ? "ring-4 ring-blue-100" : ""}
                  border-2
                `}
              >
                <span
                  className={`text-sm font-medium
                  ${isActive || isCurrent ? "text-white" : "text-gray-500"}
                `}
                >
                  {index + 1}
                </span>
              </div>
            </div>
          );
        })}

        {/* Progress bar */}
        <div className="absolute top-4 left-0 -translate-y-1/2 h-1 w-full bg-gray-200">
          <div
            className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Example usage component
const StepperExample = () => {
  const [currentStep, setCurrentStep] = React.useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full max-w-3xl mx-auto p-8 space-y-8">
      <MultiStep currentStep={currentStep} />

      <div className="flex justify-between pt-4">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-4 py-2 rounded bg-white border border-gray-300 text-gray-700
            disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50
            transition-colors duration-200"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          disabled={currentStep === 4}
          className="px-4 py-2 rounded bg-blue-500 text-white
            disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600
            transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};
