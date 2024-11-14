import { isRouteErrorResponse, Link, useParams, useRouteError } from "@remix-run/react";
import { last } from "lodash-es";

import { useEnrollCourse } from "~/api/mutations/useEnrollCourse";
import { useUnenrollCourse } from "~/api/mutations/useUnenrollCourse";
import { courseQueryOptions } from "~/api/queries/useCourse";
import { queryClient } from "~/api/queryClient";
import { CardBadge } from "~/components/CardBadge";
import CardPlaceholder from "~/assets/placeholders/card-placeholder.jpg";
import CourseProgress from "~/components/CourseProgress";
import { Gravatar } from "~/components/Gravatar";
import { Icon } from "~/components/Icon";
import Viewer from "~/components/RichText/Viever";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { CategoryChip } from "~/components/ui/CategoryChip";
import { toast } from "~/components/ui/use-toast";
import { useUserRole } from "~/hooks/useUserRole";
import { cn } from "~/lib/utils";
import CustomErrorBoundary from "~/modules/common/ErrorBoundary/ErrorBoundary";
import { PaymentModal } from "~/modules/stripe/PaymentModal";

import type { GetCourseResponse } from "~/api/generated-api";

type CourseViewMainCardProps = GetCourseResponse["data"];

export const CourseViewMainCard = ({
  author,
  authorEmail = "",
  authorId,
  category,
  completedLessonCount = 0,
  courseLessonCount,
  currency,
  description,
  enrolled: isEnrolled,
  hasFreeLessons = false,
  imageUrl,
  priceInCents,
  title,
  lessons,
}: CourseViewMainCardProps) => {
  const { mutateAsync: enrollCourse } = useEnrollCourse();
  const { mutateAsync: unenrollCourse } = useUnenrollCourse();
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
    lessons.find((lesson) => (lesson.itemsCompletedCount ?? 0) < lesson.itemsCount)?.id ??
    last(lessons)?.id;

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
      <div className="absolute top-4 left-4 right-4 flex flex-col gap-y-1">
        <CategoryChip category={category} />
        {hasFreeLessons && !isEnrolled && (
          <CardBadge variant="successFilled">
            <Icon name="FreeRight" className="w-4" />
            Free Lessons!
          </CardBadge>
        )}
      </div>
      <img
        src={imageUrl || CardPlaceholder}
        alt="Course"
        loading="eager"
        decoding="async"
        className="w-full object-cover aspect-video object-center rounded-t-2xl lg:rounded-2xl"
        onError={(e) => {
          (e.target as HTMLImageElement).src = CardPlaceholder;
        }}
      />
      <div className="flex flex-col h-full bg-white p-6 lg:p-8 pt-6 rounded-b-2xl min-h-0">
        <CourseProgress
          label="Course progress:"
          completedLessonCount={completedLessonCount}
          courseLessonCount={courseLessonCount}
        />
        <h4 className="text-2xl font-bold mt-4 lg:mt-6 leading-10 text-neutral-950">{title}</h4>
        <Link to={`/tutors/${authorId}`} className="flex items-center gap-x-1.5 mt-3 mb-4">
          <Avatar className="h-6 w-6">
            <Gravatar email={authorEmail} />
          </Avatar>
          <span className="text-primary-700">{author}</span>
        </Link>
        <div className="min-h-0 scrollbar-thin overflow-auto">
          <Viewer content={description} className="text-neutral-900 body-base" />
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
              courseCurrency={currency}
              coursePrice={priceInCents}
              courseTitle={title}
              courseId={courseId}
            />
          )}
          {!isAdmin && isEnrolled && (
            <Button
              className={cn("w-full bg-secondary-500 text-white py-2 rounded-lg", {
                "bg-white border border-secondary-500 text-secondary-700 w-full mt-3": isEnrolled,
              })}
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
