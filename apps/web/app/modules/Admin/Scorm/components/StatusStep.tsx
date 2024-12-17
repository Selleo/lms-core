import { useNavigate } from "@remix-run/react";
import { useFormContext } from "react-hook-form";

import { useCreateCourse } from "~/api/mutations";
import { useUploadFile } from "~/api/mutations/admin/useUploadFile";
import { useUploadScormPackage } from "~/api/mutations/admin/useUploadScormPackage";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { cn } from "~/lib/utils";

import { useScormFormStore } from "../store/scormForm.store";

import type { CourseFormData, CourseStatus, StepComponentProps } from "../types/scorm.types";

export function StatusStep({ handleBack, handleNext: _ }: StepComponentProps) {
  const navigate = useNavigate();
  const { setValue, watch, handleSubmit } = useFormContext<CourseFormData>();
  const { mutateAsync: createCourse, isPending: isCreateCoursePending } = useCreateCourse();
  const { mutateAsync: uploadFile, isPending: isUploadFilePending } = useUploadFile();
  const { mutateAsync: uploadScormPackage, isPending: isUploadScormPending } =
    useUploadScormPackage();

  const status = watch("status");

  const { resetForm } = useScormFormStore();

  const onSubmit = async (data: CourseFormData) => {
    try {
      const thumbnailResult = data.details.thumbnail
        ? await uploadFile({
            file: data.details.thumbnail,
            resource: "course",
          })
        : null;

      const courseResult = await createCourse({
        data: {
          categoryId: data.details.category,
          description: data.details.description,
          title: data.details.title,
          thumbnailS3Key: thumbnailResult?.fileKey,
          isScorm: true,
          priceInCents: data.pricing.price || 0 * 100,
        },
      });

      if (!courseResult?.data?.id) {
        throw new Error("Course creation failed - no course ID received");
      }

      if (!data.scorm.file) {
        throw new Error("No SCORM file provided");
      }

      await uploadScormPackage({
        file: data.scorm.file,
        courseId: courseResult.data.id,
      });

      resetForm();
      navigate("/courses");
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
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
        <Button
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
          disabled={isCreateCoursePending || isUploadFilePending || isUploadScormPending}
        >
          {isCreateCoursePending || isUploadFilePending || isUploadScormPending
            ? "Creating course..."
            : "Create Course"}
        </Button>
      </div>
    </div>
  );
}
