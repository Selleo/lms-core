import { MetaFunction } from "@remix-run/node";
import { ClientLoaderFunctionArgs } from "@remix-run/react";
import { courseQueryOptions } from "~/api/queries/useCourse";
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
  return <div className="text-2xl font-bold">Lesson page</div>;
}
