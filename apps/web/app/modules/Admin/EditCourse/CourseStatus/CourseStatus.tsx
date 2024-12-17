import * as RadioGroup from "@radix-ui/react-radio-group";

import { Button } from "~/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "~/components/ui/form";
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
        <h5 className="h5 text-neutral-950">State</h5>
        <p className="text-neutral-900 body-base">Set state for the course</p>
      </div>
      <Form {...form}>
        <form className="flex flex-col gap-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="state"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <RadioGroup.Root
                  {...field}
                  className="flex flex-col space-y-6"
                  value={field.value ? "published" : "draft"}
                  onValueChange={field.onChange}
                >
                  <RadioGroup.Item
                    value="draft"
                    id="draft"
                    className={cn("px-6 py-4 border rounded-md cursor-pointer text-left", {
                      "border-blue-500": !field.value,
                      "border-gray-300": field.value,
                    })}
                  >
                    <div className="flex items-start gap-x-4">
                      <div className="w-4 h-4 aspect-square mt-[5px] rounded-full border border-gray-300 flex justify-center items-center">
                        <RadioGroup.Indicator className="size-2.5 bg-primary-700 rounded-full" />
                      </div>
                      <div>
                        <label htmlFor="draft" className="body-lg-md text-neutral-950">
                          Draft
                        </label>
                        <p
                          className={cn("mt-1 text-sm", {
                            "text-black": !field.value,
                            "text-gray-500": field.value,
                          })}
                        >
                          Students cannot purchase or enroll in this course. For those already
                          enrolled, the course will not appear in their Student Course List.
                        </p>
                      </div>
                    </div>
                  </RadioGroup.Item>
                  <RadioGroup.Item
                    value="published"
                    id="published"
                    className={cn("px-6 py-4 border rounded-md cursor-pointer text-left", {
                      "border-blue-500": field.value,
                      "border-gray-300": !field.value,
                    })}
                  >
                    <div className="flex items-start gap-x-4">
                      <div className="w-4 h-4 aspect-square mt-[5px] rounded-full border border-gray-300 flex justify-center items-center">
                        <RadioGroup.Indicator className="size-2.5 bg-primary-700 rounded-full" />
                      </div>
                      <div>
                        <label htmlFor="published" className="body-lg-md text-neutral-950">
                          Published
                        </label>
                        <p
                          className={cn("mt-1 text-sm", {
                            "text-black": field.value,
                            "text-gray-500": !field.value,
                          })}
                        >
                          Students can purchase, enroll in, and access the course content. Once
                          enrolled, the course will be displayed on their Student Dashboard.
                        </p>
                      </div>
                    </div>
                  </RadioGroup.Item>
                </RadioGroup.Root>
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
