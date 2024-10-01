import { MetaFunction } from "@remix-run/node";
import { courseQueryOptions, useCourseSuspense } from "~/api/queries/useCourse";
import { CourseViewMainCard } from "./CourseViewMainCard";
import { LessonsList } from "./LessonsList";
import {
  ClientLoaderFunctionArgs,
  isRouteErrorResponse,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { queryClient } from "~/api/queryClient";
import CustomErrorBoundary from "~/modules/common/ErrorBoundary/ErrorBoundary";
import { useUserRole } from "~/hooks/useUserRole";

export const meta: MetaFunction = () => {
  return [{ title: "Courses" }, { name: "description", content: "Courses" }];
};

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const courseId = params.id;
  if (!courseId) return null;
  await queryClient.prefetchQuery(courseQueryOptions(courseId));
  return null;
};

export default function CoursesViewPage() {
  const { isAdmin } = useUserRole();
  const { id } = useParams<{ id: string }>();

  const { data: course } = useCourseSuspense(id ?? "");

  if (!id) {
    throw new Error("No course ID provided");
  }

  if (!course) {
    throw new Error("Course not found");
  }

  return (
    <div className="h-full">
      <div className="flex flex-col md:flex-row h-full gap-6">
        <CourseViewMainCard course={course} />
        <LessonsList
          lessons={course.lessons}
          isEnrolled={course.enrolled || isAdmin}
        />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <CustomErrorBoundary stack={error.data} />;
  } else if (error instanceof Error) {
    return <CustomErrorBoundary stack={error.stack} />;
  } else {
    return <CustomErrorBoundary />;
  }
}
