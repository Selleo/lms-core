import { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [{ title: "Courses" }, { name: "description", content: "Courses" }];
};

export default function CoursesPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-6 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Courses</h1>
        <Button>Create a course</Button>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            There are no courses yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Create a course to get started
          </p>
        </div>
      </div>
    </div>
  );
}
