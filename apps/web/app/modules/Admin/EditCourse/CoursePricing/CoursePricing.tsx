import { useTranslation } from "react-i18next";

import { PriceInput } from "~/components/PriceInput/PriceInput";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

import { useCoursePricingForm } from "./hooks/useCoursePricingForm";

type CoursePricingProps = {
  courseId: string;
  priceInCents?: number;
  currency?: string;
};

const CoursePricing = ({ courseId, priceInCents, currency }: CoursePricingProps) => {
  const { form, onSubmit } = useCoursePricingForm({ courseId, priceInCents, currency });
  const { setValue, watch } = form;
  const { t } = useTranslation();

  const isFree = watch("isFree");
  return (
    <div className="flex w-full max-w-[744px] flex-col gap-y-6 bg-white p-8">
      <div className="flex flex-col gap-y-1.5">
        <h5 className="h5 text-neutral-950">{t("adminCourseView.pricing.header")}</h5>
        <p className="body-base text-neutral-900">{t("adminCourseView.pricing.subHeader")}</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
          <div className="flex flex-col space-y-6">
            <Card
              className={cn(
                "flex w-[680px] cursor-pointer items-start gap-x-4 rounded-md border px-6 py-4",
                {
                  "bg-primary-50 border-primary-500": isFree === true,
                },
              )}
              onClick={() => setValue("isFree", true)}
            >
              <div className="mt-1.5">
                <Input
                  type="radio"
                  name="isFree"
                  checked={isFree === true}
                  onChange={() => setValue("isFree", true)}
                  className="h-4 w-4 cursor-pointer p-1"
                  id="isFree"
                />
              </div>
              <Label htmlFor="isFree" className="body-lg-md cursor-pointer text-neutral-950">
                <div className="body-lg-md mb-2 text-neutral-950">
                  {t("adminCourseView.pricing.freeCourseHeader")}
                </div>
                <div
                  className={cn("body-base", {
                    "text-neutral-900": !isFree,
                    "text-neutral-950": isFree,
                  })}
                >
                  {t("adminCourseView.pricing.freeCourseBody")}
                </div>{" "}
              </Label>
            </Card>

            <Card
              className={cn(
                "flex w-[680px] cursor-pointer items-start gap-x-4 rounded-md border px-6 py-4",
                {
                  "bg-primary-50 border-primary-500": isFree === false,
                },
              )}
              onClick={() => setValue("isFree", false)}
            >
              <div className="mt-1.5">
                <Input
                  type="radio"
                  name="isFree"
                  checked={isFree === false}
                  onChange={() => setValue("isFree", false)}
                  className="h-4 w-4 cursor-pointer p-1 pt-4"
                  id="isFree"
                />
              </div>
              <div>
                <Label htmlFor="paid" className={"body-lg-md cursor-pointer text-neutral-950"}>
                  <div className="body-lg-md mb-2 text-neutral-950">
                    {t("adminCourseView.pricing.paidCourseHeader")}
                  </div>
                  <div
                    className={cn("body-base", {
                      "text-neutral-900": isFree,
                      "text-neutral-950": !isFree,
                    })}
                  >
                    {t("adminCourseView.pricing.paidCourseBody")}
                  </div>
                </Label>
                {isFree === false && (
                  <>
                    <div className="mb-1 mt-4">
                      <Label className="text-sm font-medium" htmlFor="price">
                        <span className="text-destructive">*</span>{" "}
                        {t("adminCourseView.pricing.field.price")}
                      </Label>
                    </div>
                    <div className="mb-2">
                      <PriceInput
                        value={form.getValues("priceInCents")}
                        onChange={(value) => setValue("priceInCents", value)}
                        currency={currency}
                        placeholder={t("adminCourseView.pricing.placeholder.amount")}
                        className="[&::-moz-appearance]:textfield appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        aria-label={t("adminCourseView.pricing.field.price")}
                      />
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
          <Button className="w-20" type="submit">
            {t("common.button.save")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CoursePricing;
