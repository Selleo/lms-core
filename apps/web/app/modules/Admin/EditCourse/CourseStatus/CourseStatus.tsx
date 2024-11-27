import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";

import { useCourseStatusForm } from "./hooks/useCourseStatusForm";

type CourseStatusProps = {
  courseId: string;
  state?: string;
};

const CourseStatus = ({ courseId, state }: CourseStatusProps) => {
  const { form, onSubmit } = useCourseStatusForm({ courseId, state });
  return (
    <div className="w-full flex gap-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <h5 className="text-xl font-semibold">Status</h5>
        </CardHeader>
        <CardContent>
          <p>Set status for the course</p>
          <Form {...form}>
            <form className="mt-10 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseStatus;
