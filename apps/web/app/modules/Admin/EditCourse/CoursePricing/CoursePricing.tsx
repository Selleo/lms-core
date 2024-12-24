import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useCoursePricingForm } from "./hooks/useCoursePricingForm";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

type CoursePricingProps = {
  courseId: string;
  priceInCents?: number;
  currency?: string;
};

const CoursePricing = ({ courseId, priceInCents, currency }: CoursePricingProps) => {
  const { form, onSubmit } = useCoursePricingForm({ courseId, priceInCents, currency });
  const { setValue, register, watch } = form;

  const isFree = watch("isFree");
  return (
    <div className="flex flex-col p-8 w-full gap-y-6 bg-white max-w-[744px]">
      <div className="flex flex-col gap-y-1.5">
        <h5 className="h5 text-neutral-950">Pricing</h5>
        <p className="text-neutral-900 body-base">Set pricing for the course</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
          <div className="flex flex-col space-y-6">
            <Card
              className={cn(
                "flex items-start gap-x-4 px-6 py-4 border rounded-md cursor-pointer w-[680px]",
                {
                  "bg-primary-50 border-primary-500": isFree === true,
                },
              )}
              onClick={() => setValue("isFree", true)}
            >
              <div className="mt-2">
                <Input
                  type="radio"
                  name="isFree"
                  checked={isFree === true}
                  onChange={() => setValue("isFree", true)}
                  className="p-1 w-4 h-4 cursor-pointer"
                  id="isFree"
                />
              </div>
              <Label htmlFor="isFree" className="body-lg-md text-neutral-950 cursor-pointer">
                <div className="font-medium text-lg text-neutral-950 mb-2">Free</div>
                <div className="text-sm font-normal">
                  Students can enroll in, and access the course content without paying.
                </div>
              </Label>
            </Card>

            <Card
              className={cn(
                "flex items-start gap-x-4 px-6 py-4 border rounded-md cursor-pointer w-[680px]",
                {
                  "bg-primary-50 border-primary-500": isFree === false,
                },
              )}
              onClick={() => setValue("isFree", false)}
            >
              <div className="mt-2">
                <Input
                  type="radio"
                  name="isFree"
                  checked={isFree === false}
                  onChange={() => setValue("isFree", false)}
                  className="p-1 w-4 h-4 pt-4 cursor-pointer"
                  id="isFree"
                />
              </div>
              <div>
                <Label htmlFor="paid" className="body-lg-md text-neutral-950 cursor-pointer">
                  <div className="font-medium text-lg text-neutral-950 mb-2">Paid course</div>
                  <div className="text-sm font-normal mb-6">
                    Students can purchase and access the course content. Once selected, you can
                    define currency and price.
                  </div>
                </Label>
                {isFree === false && (
                  <>
                    <div className="mb-2">
                      <Label className="text-sm font-medium" htmlFor="price">
                        <span className="text-destructive">*</span> Price
                      </Label>
                    </div>
                    <div className="relative mb-2">
                      <Input
                        id="priceInCents"
                        {...register("priceInCents", {
                          valueAsNumber: true,
                        })}
                        placeholder="Amount"
                        type="number"
                        className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-moz-appearance]:textfield"
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
          <Button className="w-20" type="submit">
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CoursePricing;
