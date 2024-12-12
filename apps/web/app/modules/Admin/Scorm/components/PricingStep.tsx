import { useFormContext } from "react-hook-form";

import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

import { StepWrapper } from "./StepWrapper";

import type { CourseFormData, PricingType, StepComponentProps } from "../types/scorm.types";

export function PricingStep({ title, description }: StepComponentProps) {
  const { setValue, watch } = useFormContext<CourseFormData>();
  const pricingType = watch("pricing.type");

  return (
    <div className="space-y-6">
      <StepWrapper title={title} description={description}>
        <RadioGroup
          defaultValue={pricingType}
          onValueChange={(value: PricingType) => setValue("pricing.type", value)}
        >
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center space-x-4">
                <RadioGroupItem value="free" id="free" />
                <Label htmlFor="free" className="flex-1">
                  <div className="font-medium">Free</div>
                  <div className="text-sm text-muted-foreground">
                    Students can enroll in, and access the course content without paying.
                  </div>
                </Label>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-4">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid" className="flex-1">
                  <div className="font-medium">Paid course</div>
                  <div className="text-sm text-muted-foreground">
                    Students can purchase and access the course content. Once selected, you can
                    define currency and price.
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
