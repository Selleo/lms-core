import { MetaFunction } from "@remix-run/node";
import { PageWrapper } from "~/components/PageWrapper";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [{ title: "Courses" }, { name: "description", content: "Courses" }];
};

const CoursesButton = () => <Button>Create a course</Button>;

export default function CoursesPage() {
  return (
    <PageWrapper header="Courses" PageWrapperButton={CoursesButton}>
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
    </PageWrapper>
  );
}
