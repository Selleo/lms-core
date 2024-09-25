import { Button } from "~/components/ui/button";
import { GetCourseResponse } from "~/api/generated-api";
import { useEnrollCourse } from "~/api/mutations/useEnrollCourse";
import {
  isRouteErrorResponse,
  Link,
  useParams,
  useRouteError,
} from "@remix-run/react";
import CustomErrorBoundary from "~/modules/common/ErrorBoundary/ErrorBoundary";
import { useUnenrollCourse } from "~/api/mutations/useUnenrollCourse";
import { queryClient } from "~/api/queryClient";
import { courseQueryOptions } from "~/api/queries/useCourse";
import { toast } from "~/components/ui/use-toast";
import {CategoryChip} from "~/components/ui/CategoryChip";

export const CourseViewMainCard = ({
  course,
}: {
  course: GetCourseResponse["data"];
}) => {
  const {
    category,
    description,
    imageUrl,
    title,
    enrolled: isEnrolled,
    courseLessonCount,
  } = course;
  const { mutateAsync: enrollCourse } = useEnrollCourse();
  const { mutateAsync: unenrollCourse } = useUnenrollCourse();
  const { id: courseId } = useParams<{ id: string }>();

  if (!courseId) {
    toast({
      description: "Course ID not found",
      variant: "destructive",
    });
    throw new Error("Course ID not found");
  }

  const COMPLETED_LESSONS_COUNT = 2; // TODO: Replace with actual count when available

  const handleEnroll = () => {
    enrollCourse({ id: courseId }).then(() => {
      queryClient.invalidateQueries(courseQueryOptions(courseId));
    });
  };

  const handleUnenroll = () => {
    unenrollCourse({ id: courseId }).then(() => {
      queryClient.invalidateQueries(courseQueryOptions(courseId));
    });
  };

  return (
    <div className="md:w-[380px] lg:w-[380px] xl:w-[480px] shrink-0 flex flex-col rounded-2xl bg-white drop-shadow-xl relative">
      <div className="absolute top-4 left-4 right-4">
      <CategoryChip category={category} />
      </div>
      <img
        src={
          imageUrl ||
          "https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp"
        }
        alt="Course"
        className="w-full object-cover aspect-video object-center rounded-2xl"
      />
      <div className="flex flex-col h-full bg-white p-8 rounded-b-2xl min-h-0">
        <div className="gap-2 flex flex-col">
          <p className="text-neutral-600 text-xs">
            Course progress: 2/{courseLessonCount}
          </p>
          <div className="flex grow items-center gap-px">
            {Array.from({ length: COMPLETED_LESSONS_COUNT }).map((_, index) => (
              <span
                key={index}
                className="h-[5px] grow bg-secondary-500 rounded-[40px]"
              />
            ))}
            {Array.from({
              length: courseLessonCount - COMPLETED_LESSONS_COUNT,
            }).map((_, index) => (
              <span
                key={index}
                className="h-[5px] grow bg-primary-50 rounded-[40px]"
              />
            ))}
          </div>
        </div>
        <h2 className="text-2xl font-bold mt-6">{title}</h2>
        <div className="min-h-0 overflow-auto">
          <p className="mt-4 text-gray-600">{description}</p>
        </div>
        <div className="mt-auto">
          {isEnrolled && (
            <Link to="#">
              <Button className="mt-4 w-full bg-secondary-500 text-white py-2 rounded-lg">
                Continue
              </Button>
            </Link>
          )}
          {!isEnrolled && (
            <Button
              onClick={handleEnroll}
              className="mt-4 w-full bg-secondary-500 text-white py-2 rounded-lg"
            >
              Enroll
            </Button>
          )}
          {isEnrolled && (
            <Button
              className="bg-white border border-neutral-500 text-neutral-900 w-full mt-2"
              onClick={handleUnenroll}
            >
              Unenroll
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

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
