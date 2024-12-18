import { useFormContext } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { cn } from "~/lib/utils";

import { useScormFormStore } from "../store/scormForm.store";

import type { CourseFormData, PricingType, StepComponentProps } from "../types/scorm.types";

export function PricingStep({ handleBack, handleNext }: StepComponentProps) {
  const { setValue, watch, register } = useFormContext<CourseFormData>();
  const currency = useScormFormStore((state) => state.formData.pricing?.currency);
  const pricingType = watch("pricing.type");

  return (
    <div className="space-y-6">
      <RadioGroup
        defaultValue={pricingType}
        onValueChange={(value: PricingType) => setValue("pricing.type", value)}
      >
        <div className="space-y-4">
          <Card
            className={cn("pl-4 flex items-start space-x-4", {
              "bg-primary-50 border-primary-500": pricingType === "free",
            })}
          >
            <RadioGroupItem value="free" id="free" className="my-5" />
            <Label
              htmlFor="free"
              className="flex-1 gap-2 flex flex-col cursor-pointer size-full py-4"
            >
              <div className="font-medium text-lg">Free</div>
              <div className="text-sm font-normal">
                Students can enroll in, and access the course content without paying.
              </div>
            </Label>
          </Card>

          <Card
            className={cn("px-4 flex items-start space-x-4", {
              "bg-primary-50 border-primary-500": pricingType === "paid",
            })}
          >
            <RadioGroupItem value="paid" id="paid" className="my-5" />
            <div className="flex flex-col py-4">
              <Label htmlFor="paid" className="flex-1 gap-2 flex flex-col cursor-pointer size-full">
                <div className="font-medium text-lg">Paid course</div>
                <div className="text-sm font-normal">
                  Students can purchase and access the course content. Once selected, you can define
                  currency and price.
                </div>
              </Label>

              {pricingType === "paid" && (
                <>
                  <Label className="text-sm font-medium mt-6" htmlFor="price">
                    <span className="text-destructive">*</span> Price
                  </Label>
                  <div className="relative">
                    <Input
                      id="price"
                      {...register("pricing.price", {
                        valueAsNumber: true,
                      })}
                      placeholder="Amount"
                      type="number"
                    />
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-4 uppercase">
                      {currency}
                    </span>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </RadioGroup>

      <div className="flex gap-3">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleNext}>Status</Button>
      </div>
    </div>
  );
}
