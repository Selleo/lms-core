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

  const courseTitle = courseData?.title || "Course";
  const lessonTitle = lessonData?.title || "Lesson";

  return (
    <BreadcrumbList className="mt-6">
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
      <BreadcrumbItem>{lessonTitle}</BreadcrumbItem>
    </BreadcrumbList>
  );
}
