import { Card } from "~/components/ui/card";
import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { courseQueryOptions } from "~/api/queries/useCourse";
import { lessonQueryOptions } from "~/api/queries/useLesson";
import { MetaFunction } from "@remix-run/node";
import { queryClient } from "~/api/queryClient";

export const meta: MetaFunction = () => {
  return [{ title: "Lesson" }, { name: "description", content: "lesson" }];
};

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const courseId = params.courseId;
  const lessonId = params.lessonId;
  courseId && (await queryClient.prefetchQuery(courseQueryOptions(courseId)));
  lessonId && (await queryClient.prefetchQuery(lessonQueryOptions(lessonId)));
  return null;
};

export default function LessonPage() {
  return (
    <Card className="w-full p-8">
      <div className="text-2xl font-bold h-[400px]">Lesson page</div>
    </Card>
  );
}
