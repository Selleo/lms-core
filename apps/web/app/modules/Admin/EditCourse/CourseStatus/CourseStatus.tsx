import * as RadioGroup from "@radix-ui/react-radio-group";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { cn } from "~/lib/utils";

import { useCourseStatusForm } from "./hooks/useCourseStatusForm";

type CourseStateProps = {
  courseId: string;
  state?: string;
};

const CourseState = ({ courseId, state }: CourseStateProps) => {
  const { form, onSubmit } = useCourseStatusForm({ courseId, state });

  return (
    <div className="w-full flex gap-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <h5 className="text-xl font-semibold">State</h5>
        </CardHeader>
        <CardContent>
          <p>Set state for the course</p>
          <Form {...form}>
            <form className="mt-10 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="state"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <RadioGroup.Root
                      {...field}
                      className="flex flex-col space-y-4"
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <RadioGroup.Item
                        value="draft"
                        id="draft"
                        className={cn("p-4 border rounded-md cursor-pointer text-left", {
                          "border-blue-500": field.value === "draft",
                          "border-gray-300": field.value !== "draft",
                        })}
                      >
                        <div className="flex items-start">
                          <div className="w-6 h-6 aspect-square rounded-full border border-gray-300 flex justify-center items-center mr-3">
                            <RadioGroup.Indicator className="w-3 h-3 bg-blue-500 rounded-full" />
                          </div>
                          <div>
                            <label htmlFor="draft" className="text-base font-medium">
                              Draft
                            </label>
                            <p
                              className={cn("mt-1 text-sm", {
                                "text-black": field.value === "draft",
                                "text-gray-500": field.value !== "draft",
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
                        className={cn("p-4 border rounded-md cursor-pointer text-left", {
                          "border-blue-500": field.value === "published",
                          "border-gray-300": field.value !== "published",
                        })}
                      >
                        <div className="flex items-start">
                          <div className="w-6 h-6 aspect-square rounded-full border border-gray-300 flex justify-center items-center mr-3">
                            <RadioGroup.Indicator className="w-3 h-3 bg-blue-500 rounded-full" />
                          </div>
                          <div>
                            <label htmlFor="published" className="text-base font-medium">
                              Published
                            </label>
                            <p
                              className={cn("mt-1 text-sm", {
                                "text-black": field.value === "published",
                                "text-gray-500": field.value !== "published",
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
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseState;
