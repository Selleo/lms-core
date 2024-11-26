import {
  type ClientLoaderFunctionArgs,
  isRouteErrorResponse,
  useParams,
  useRouteError,
} from "@remix-run/react";

import { courseQueryOptions, useCourseSuspense } from "~/api/queries";
import { queryClient } from "~/api/queryClient";
import { PageWrapper } from "~/components/PageWrapper";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { useUserRole } from "~/hooks/useUserRole";
import CustomErrorBoundary from "~/modules/common/ErrorBoundary/ErrorBoundary";

import { CourseViewMainCard } from "./CourseViewMainCard";
import { LessonsList } from "./LessonsList";

import type { MetaFunction } from "@remix-run/node";

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
    <PageWrapper className="flex flex-col gap-y-4 md:gap-y-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/`}>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/course/${id}`}>{course.title}</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
      <div className="flex flex-col md:flex-row h-full gap-6">
        <CourseViewMainCard {...course} />
        <LessonsList lessons={course.lessons} isEnrolled={course.enrolled || isAdmin} />
      </div>
    </PageWrapper>
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
