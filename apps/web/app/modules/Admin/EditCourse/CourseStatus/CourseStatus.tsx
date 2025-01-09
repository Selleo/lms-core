// TODO: Need to be fixed
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
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

  return (
    <div className="flex flex-col p-8 w-full gap-y-6 bg-white max-w-[744px]">
      <div className="flex flex-col gap-y-1.5">
        <h5 className="h5 text-neutral-950">Status</h5>
        <p className="text-neutral-900 body-base">Set state for the course</p>
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
                    <Input
                      type="radio"
                      name="isPublished"
                      checked={field.value === false}
                      onChange={() => field.onChange(false)}
                      className="p-1 w-6 h-6"
                      id="draft"
                    />
                    <div>
                      <Label htmlFor="draft" className="body-lg-md text-neutral-950">
                        Draft
                      </Label>
                      <p
                        className={cn("mt-1 text-sm", {
                          "text-black": field.value === false,
                          "text-gray-500": field.value !== false,
                        })}
                      >
                        Students cannot purchase or enroll in this course. For those already
                        enrolled, the course will not appear in their Student Course List.
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
                    <Input
                      type="radio"
                      name="isPublished"
                      checked={field.value === true}
                      onChange={() => field.onChange(true)}
                      className="p-1 w-6 h-6"
                      id="published"
                    />
                    <div>
                      <Label htmlFor="published" className="body-lg-md text-neutral-950">
                        Published
                      </Label>
                      <p
                        className={cn("mt-1 text-sm", {
                          "text-neutral-950": field.value === true,
                          "text-neutral-900": field.value !== true,
                        })}
                      >
                        Students can purchase, enroll in, and access the course content. Once
                        enrolled, the course will be displayed on their Student Dashboard.
                      </p>
                    </div>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save</Button>
        </form>
      </Form>
    </div>
  );
};

export default CoursePublishStatus;
