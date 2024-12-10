import { useState } from "react";

import Stepper from "~/components/Stepper/Stepper";

import { ComponentsWrapper } from "./scorm/ComponentsWrapper";
import { UploadStep } from "./scorm/steps/Upload";

import type { FormGroupConfig, Step } from "~/components/Stepper/types";

export default function CreateNewScormCourse() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps: Step[] = [
    {
      title: "Upload SCORM",
      description: "Upload your .zip file in SCORM format",
      stepId: 1,
      content: <UploadStep />,
    },
    {
      title: "Basic Settings",
      description: "Configure basic course settings",
      stepId: 2,
      content: (
        <div className="space-y-4">
          <input type="text" className="w-full p-2 border rounded" placeholder="Course name" />
        </div>
      ),
    },
    {
      steps: [
        {
          title: "Form Part 1",
          description: "First part of the form",
          stepId: 3,
          content: (
            <div className="space-y-4">
              <input type="text" className="w-full p-2 border rounded" placeholder="Form field 1" />
            </div>
          ),
        },
        {
          title: "Form Part 2",
          stepId: 4,
          content: (
            <div className="space-y-4">
              <textarea className="w-full p-2 border rounded" placeholder="Form field 2" />
            </div>
          ),
        },
        {
          title: "Form Part 3",
          stepId: 5,
          content: (
            <div className="space-y-4">
              <select className="w-full p-2 border rounded">
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>
          ),
        },
      ],
      startStep: 3,
      endStep: 5,
    } as FormGroupConfig,
    {
      title: "Preview",
      stepId: 6,
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded">Preview content...</div>
        </div>
      ),
    },
    {
      title: "Publish",
      stepId: 7,
      content: (
        <div className="space-y-4">
          <button className="px-4 py-2 bg-green-500 text-white rounded">Publish Course</button>
        </div>
      ),
    },
  ];

  const stepComponents = steps.map((step, index) => {
    if ("steps" in step) {
      const formGroup = step as FormGroupConfig;
      return (
        <Stepper.FormGroup
          key={index}
          startStep={formGroup.startStep}
          endStep={formGroup.endStep}
          steps={formGroup.steps}
        >
          {formGroup.steps.map((subStep) =>
            subStep.stepId === currentStep ? subStep.content : null,
          )}
        </Stepper.FormGroup>
      );
    }

    return (
      <Stepper.Step key={index} stepId={step.stepId}>
        <ComponentsWrapper leftContent={step.content} rightContent={<h2>test</h2>} />
      </Stepper.Step>
    );
  });

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 7));
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full max-w-3xl mx-auto p-8 space-y-8">
      <Stepper
        currentStep={currentStep}
        totalSteps={7}
        onNext={handleNext}
        onPrev={handlePrev}
        steps={steps}
      >
        {stepComponents}
      </Stepper>
    </div>
  );
}
