import { Card } from "~/components/ui/card";
import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { courseQueryOptions } from "~/api/queries/useCourse";
import { MetaFunction } from "@remix-run/node";
import { queryClient } from "~/api/queryClient";

export const meta: MetaFunction = () => {
  return [{ title: "Lesson" }, { name: "description", content: "lesson" }];
};

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const courseId = params.courseId;
  courseId && (await queryClient.prefetchQuery(courseQueryOptions(courseId)));
  return null;
};

export default function LessonPage() {
  return (
    <Card className="w-full p-8">
      <div className="text-2xl font-bold h-[400px]">Lesson page</div>
    </Card>
  );
}
