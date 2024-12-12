import { useFormContext } from "react-hook-form";

import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

import { StepWrapper } from "./StepWrapper";

import type { CourseFormData, CourseStatus, StepComponentProps } from "../types/scorm.types";

export function StatusStep({ title, description }: StepComponentProps) {
  const { setValue, watch } = useFormContext<CourseFormData>();
  const status = watch("status");

  return (
    <div className="space-y-6">
      <StepWrapper title={title} description={description}>
        <RadioGroup
          defaultValue={status}
          onValueChange={(value: CourseStatus) => setValue("status", value)}
        >
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center space-x-4">
                <RadioGroupItem value="draft" id="draft" />
                <Label htmlFor="draft" className="flex-1">
                  <div className="font-medium">Draft</div>
                  <div className="text-sm text-muted-foreground">
                    Students cannot purchase or enroll in this course. For those already enrolled,
                    the course will not appear in their Student Course List.
                  </div>
                </Label>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-4">
                <RadioGroupItem value="published" id="published" />
                <Label htmlFor="published" className="flex-1">
                  <div className="font-medium">Publish</div>
                  <div className="text-sm text-muted-foreground">
                    Students can purchase, enroll in, and access the course content. Once enrolled,
                    the course will be displayed on their Student Dashboard.
                  </div>
                </Label>
              </div>
            </Card>
          </div>
        </RadioGroup>
      </StepWrapper>
    </div>
  );
}
