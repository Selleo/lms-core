import { useFormContext } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { cn } from "~/lib/utils";

import type { CourseFormData, CourseStatus, StepComponentProps } from "../types/scorm.types";

export function StatusStep({ handleBack, handleNext: _ }: StepComponentProps) {
  const { setValue, watch, handleSubmit } = useFormContext<CourseFormData>();
  const status = watch("status");

  // TODO:
  // const createCourse = useMutation({
  //   mutationFn: (data: Omit<CourseFormData, "scorm">) => api.courses.createCourse(data),
  // });

  // TODO:
  // const uploadScorm = useMutation({
  // mutationFn: ({ courseId, file }: { courseId: string; file: File }) =>
  // api.scorm.scormControllerUploadScormPackage({ courseId }, { file }),
  // });

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

  return (
    <div className="space-y-6">
      <RadioGroup
        defaultValue={status}
        onValueChange={(value: CourseStatus) => setValue("status", value)}
      >
        <div className="space-y-4">
          <Card
            className={cn("px-4 flex items-start space-x-4", {
              "bg-primary-50 border-primary-500": status === "draft",
            })}
          >
            <RadioGroupItem value="draft" id="draft" className="my-5" />
            <Label
              htmlFor="draft"
              className="flex-1 gap-2 flex flex-col cursor-pointer size-full py-4"
            >
              <div className="font-medium text-lg">Draft</div>
              <div className="text-sm font-normal">
                Students cannot purchase or enroll in this course. For those already enrolled, the
                course will not appear in their Student Course List.
              </div>
            </Label>
          </Card>

          <Card
            className={cn("px-4 flex items-start space-x-4", {
              "bg-primary-50 border-primary-500": status === "published",
            })}
          >
            <RadioGroupItem value="published" id="published" className="my-5" />
            <Label
              htmlFor="published"
              className="flex-1 gap-2 flex flex-col cursor-pointer size-full py-4"
            >
              <div className="font-medium text-lg">Publish</div>
              <div className="text-sm font-normal">
                Students can purchase, enroll in, and access the course content. Once enrolled, the
                course will be displayed on their Student Dashboard.
              </div>
            </Label>
          </Card>
        </div>
      </RadioGroup>

      <div className="flex gap-3">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleSubmit(onSubmit)}>Create Course</Button>
      </div>
    </div>
  );
}
