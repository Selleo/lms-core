import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { StepWrapper } from "./components/StepWrapper";
import { courseFormSchema } from "./schema/course.schema";
import { SCORM_CONFIG } from "./scorm.config";
import { useScormFormStore } from "./store/scormForm.store";

import type { CourseFormData } from "./types/scorm.types";

function CreateNewScormCourse() {
  const { currentStep, formData, setCurrentStep, setFormData } = useScormFormStore();

  useEffect(() => {
    if (currentStep >= SCORM_CONFIG.length) {
      setCurrentStep(0);
    }
    // only in first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: formData,
  });

  const {
    // trigger,
    // formState: { isValid },
    watch,
  } = form;

  useEffect(() => {
    const subscription = watch((value) => {
      setFormData(value as CourseFormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, setFormData]);

  const nextStep = async () => {
    // TODO:
    const isStepValid = true;
    // const isStepValid = await trigger();
    if (isStepValid && currentStep < SCORM_CONFIG.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const {
    title: stepTitle,
    description: stepDescription,
    Component: CurrentStep,
    SideComponent,
  } = SCORM_CONFIG[currentStep];
  const { t } = useTranslation();

  return (
    <div className="flex size-full gap-[120px] bg-white p-20">
      <div className="flex-1">
        <FormProvider {...form}>
          <div className="mx-auto max-w-2xl p-6">
            <StepWrapper title={t(stepTitle)} description={t(stepDescription)}>
              <CurrentStep handleBack={prevStep} handleNext={nextStep} />
            </StepWrapper>
          </div>
        </FormProvider>
      </div>
      <div className="bg-primary-50 flex h-full flex-1 items-center justify-center rounded-2xl">
        <SideComponent />
      </div>
    </div>
  );
}

export default CreateNewScormCourse;
