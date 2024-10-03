import {
  isRouteErrorResponse,
  Link,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { last } from "lodash-es";
import type { GetCourseResponse } from "~/api/generated-api";
import { useEnrollCourse } from "~/api/mutations/useEnrollCourse";
import { useUnenrollCourse } from "~/api/mutations/useUnenrollCourse";
import { courseQueryOptions } from "~/api/queries/useCourse";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import { CategoryChip } from "~/components/ui/CategoryChip";
import { toast } from "~/components/ui/use-toast";
import { useUserRole } from "~/hooks/useUserRole";
import { cn } from "~/lib/utils";
import CustomErrorBoundary from "~/modules/common/ErrorBoundary/ErrorBoundary";
import { PaymentModal } from "~/modules/stripe/PaymentModal";

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
    completedLessonCount,
    priceInCents,
  } = course;
  const { mutateAsync: unenrollCourse } = useUnenrollCourse();
  const { mutateAsync: enrollCourse } = useEnrollCourse();
  const { id: courseId } = useParams<{ id: string }>();
  const { isAdmin } = useUserRole();

  const isPayable = Boolean(priceInCents);

  if (!courseId) {
    toast({
      description: "Course ID not found",
      variant: "destructive",
    });
    throw new Error("Course ID not found");
  }

  const firstUncompletedLesson =
    course.lessons.find(
      (lesson) => lesson.itemsCompletedCount < lesson.itemsCount
    )?.id ?? last(course.lessons)?.id;

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
    <div className="md:w-[380px] xl:w-[480px] shrink-0 flex flex-col rounded-2xl bg-white drop-shadow-primary relative">
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
      <div className="flex flex-col h-full bg-white p-8 pt-6 rounded-b-2xl min-h-0">
        <div className="gap-2 flex flex-col">
          <p className="text-neutral-600 text-xs leading-5">
            Course progress: {completedLessonCount}/{courseLessonCount}
          </p>
          <div className="flex grow items-center gap-px">
            {Array.from({ length: completedLessonCount }).map((_, index) => (
              <span
                key={index}
                className="h-[5px] grow bg-secondary-500 rounded-[40px]"
              />
            ))}
            {Array.from({
              length: courseLessonCount - completedLessonCount,
            }).map((_, index) => (
              <span
                key={index}
                className="h-[5px] grow bg-primary-50 rounded-[40px]"
              />
            ))}
          </div>
        </div>
        <h4 className="text-2xl font-bold mt-6 leading-10 text-neutral-950">
          {title}
        </h4>
        <div className="min-h-0 scrollbar-thin overflow-auto">
          <p className="mt-4 text-neutral-900 leading-7 font-normal">
            {description}
          </p>
        </div>
        <div className="mt-auto">
          {!isAdmin && isEnrolled && (
            <Link to={`lesson/${firstUncompletedLesson}`}>
              <Button className="mt-4 w-full bg-secondary-500 text-white py-2 rounded-lg">
                Continue
              </Button>
            </Link>
          )}
          {!isAdmin && !isEnrolled && !isPayable && (
            <Button
              className="mt-4 w-full bg-secondary-500 text-white py-2 rounded-lg"
              onClick={handleEnroll}
            >
              Enroll
            </Button>
          )}
          {!isAdmin && !isEnrolled && isPayable && (
            <PaymentModal
              courseCurrency="usd" // TODO: Add currency from the course when available
              coursePrice={priceInCents}
              courseTitle={title}
              courseId={courseId}
            />
          )}
          {!isAdmin && isEnrolled && (
            <Button
              className={cn(
                "w-full bg-secondary-500 text-white py-2 rounded-lg",
                {
                  "bg-white border border-secondary-500 text-secondary-700 w-full mt-3":
                    isEnrolled,
                }
              )}
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
