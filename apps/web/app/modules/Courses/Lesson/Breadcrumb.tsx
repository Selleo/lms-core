import { useParams } from "@remix-run/react";
import { useCourseSuspense } from "~/api/queries/useCourse";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

export default function Breadcrumb() {
  const { courseId } = useParams();
  const { data } = useCourseSuspense(courseId!);

  const courseTitle = data?.title || "Course";
  //TODO - add lesson name to breadcrumb in similar way as course

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
      <BreadcrumbItem>Lesson Name</BreadcrumbItem>
    </BreadcrumbList>
  );
}
