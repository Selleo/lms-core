// TODO: Need to be fixed
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

import { useCourseStatusForm } from "./hooks/useCourseStatusForm";

type CoursePublishStatusProps = {
  courseId: string;
  isPublished?: boolean;
};

const CoursePublishStatus = ({ courseId, isPublished }: CoursePublishStatusProps) => {
  const { form, onSubmit } = useCourseStatusForm({ courseId, isPublished });
  const { t } = useTranslation();

  return (
    <div className="flex flex-col p-8 w-full gap-y-6 bg-white max-w-[744px]">
      <div className="flex flex-col gap-y-1.5">
        <h5 className="h5 text-neutral-950">{t("adminCourseView.status.header")}</h5>
        <p className="text-neutral-900 body-base">{t("adminCourseView.status.subHeader")}</p>
      </div>
      <Form {...form}>
        <form className="flex flex-col gap-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="isPublished"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col space-y-6">
                  <div
                    className={cn(
                      "flex items-start gap-x-4 px-6 py-4 border rounded-md cursor-pointer",
                      {
                        "border-blue-500": field.value === false,
                        "border-gray-300": field.value !== false,
                      },
                    )}
                    onClick={() => field.onChange(false)}
                  >
                    <div className="mt-1.5">
                      <Input
                        type="radio"
                        name="isPublished"
                        checked={field.value === false}
                        onChange={() => field.onChange(false)}
                        className="p-1 w-4 h-4 cursor-pointer"
                        id="draft"
                      />
                    </div>
                    <div>
                      <Label htmlFor="draft" className="body-lg-md text-neutral-950 cursor-pointer">
                        <div className="body-lg-md text-neutral-950 mb-2">
                          {t("adminCourseView.status.draftHeader")}
                        </div>
                      </Label>
                      <p
                        className={cn("mt-1 body-base", {
                          "text-black": field.value === false,
                          "text-gray-500": field.value !== false,
                        })}
                      >
                        {t("adminCourseView.status.draftBody")}
                      </p>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "flex items-start gap-x-4 px-6 py-4 border rounded-md cursor-pointer",
                      {
                        "border-blue-500": field.value === true,
                        "border-gray-300": field.value !== true,
                      },
                    )}
                    onClick={() => field.onChange(true)}
                  >
                    <div className="mt-1.5">
                      <Input
                        type="radio"
                        name="isPublished"
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                        className="p-1 w-4 h-4 cursor-pointer"
                        id="published"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="published"
                        className="body-lg-md text-neutral-950 cursor-pointer"
                      >
                        <div className="body-lg-md text-neutral-950 mb-2">
                          {t("adminCourseView.status.publishedHeader")}
                        </div>
                      </Label>
                      <p
                        className={cn("mt-1 body-base", {
                          "text-neutral-950": field.value === true,
                          "text-neutral-900": field.value !== true,
                        })}
                      >
                        {t("adminCourseView.status.publishedBody")}
                      </p>
                    </div>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-20">
            <Button type="submit">{t("common.button.save")}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CoursePublishStatus;
