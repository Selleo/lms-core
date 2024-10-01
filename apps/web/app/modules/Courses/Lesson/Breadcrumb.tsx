import { useParams } from "@remix-run/react";
import { useCourseSuspense } from "~/api/queries/useCourse";
import { useLessonSuspense } from "~/api/queries/useLesson";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

export default function Breadcrumb() {
  const { courseId, lessonId } = useParams();
  const { data: courseData } = useCourseSuspense(courseId!);
  const { data: lessonData } = useLessonSuspense(lessonId!);

  if (!courseData) {
    throw new Error(`Course with id: ${courseId} not found`);
  }

  if (!lessonData) {
    throw new Error(`Lesson with id: ${lessonId} not found`);
  }

  const courseTitle = courseData?.title || "Course";
  const lessonTitle = lessonData?.title || "Lesson";

  return (
    <div className="bg-primary-50">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/`}>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/course/${courseId}`}>
            {courseTitle}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="text-neutral-950">
          {lessonTitle}
        </BreadcrumbItem>
      </BreadcrumbList>
    </div>
  );
}
