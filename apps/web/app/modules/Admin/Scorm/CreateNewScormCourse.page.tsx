import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";

import { STEPS } from "./constants/scorm.consts";
import { courseFormSchema } from "./schema/course.schema";
import { useScormFormStore } from "./store/scormForm.store";

import type { CourseFormData } from "./types/scorm.types";

function CreateNewScormCourse() {
  const { currentStep, formData, setCurrentStep, setFormData } = useScormFormStore();

  useEffect(() => {
    if (currentStep >= STEPS.length) {
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
    handleSubmit,
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

  const createCourse = useMutation({
    // TODO:
    // mutationFn: (data: Omit<CourseFormData, "scorm">) => api.courses.createCourse(data),
  });

  const uploadScorm = useMutation({
    // TODO:
    // mutationFn: ({ courseId, file }: { courseId: string; file: File }) =>
    // api.scorm.scormControllerUploadScormPackage({ courseId }, { file }),
  });

  const nextStep = async () => {
    const isStepValid = true;
    // const isStepValid = await trigger();
    if (isStepValid && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: CourseFormData) => {
    console.log(data);
    // TODO:
    // try {
    //   const course = await createCourse.mutateAsync({
    //     details: data.details,
    //     pricing: data.pricing,
    //     status: data.status,
    //   });
    //   if (data.scorm.file && course.id) {
    //     await uploadScorm.mutateAsync({
    //       courseId: course.id,
    //       file: data.scorm.file,
    //     });
    //   }
    //   // router.push("/courses");
    // } catch (error) {
    //   console.error("Error creating course:", error);
    // }
  };

  const safeCurrentStep = Math.min(Math.max(0, currentStep), STEPS.length - 1);
  const {
    title: stepTitle,
    description: stepDescription,
    Component: CurrentStep,
  } = STEPS[safeCurrentStep];

  return (
    <div className="size-full gap-[120px] flex p-20 bg-white">
      <div className="flex-1">
        <FormProvider {...form}>
          <div className="max-w-2xl mx-auto p-6">
            <CurrentStep title={stepTitle} description={stepDescription} />

            <div className="mt-8 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Back
              </Button>

              {safeCurrentStep === STEPS.length - 1 ? (
                <Button
                  onClick={handleSubmit(onSubmit)}
                  // TODO:
                  // disabled={!isValid || createCourse.isPending || uploadScorm.isPending}
                >
                  {/* TODO: Remove nested ternary */}
                  {createCourse.isPending
                    ? "Creating course..."
                    : uploadScorm.isPending
                      ? "Uploading SCORM..."
                      : "Create Course"}
                </Button>
              ) : (
                <Button type="button" onClick={nextStep} disabled={currentStep >= STEPS.length - 1}>
                  Continue
                </Button>
              )}
            </div>
          </div>
        </FormProvider>
      </div>
      <div className="flex-1 h-full bg-primary-50 rounded-2xl flex items-center justify-center">
        test
      </div>
    </div>
  );
}

export default CreateNewScormCourse;
