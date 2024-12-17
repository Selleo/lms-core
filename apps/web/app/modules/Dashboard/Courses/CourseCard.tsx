import { Link, useLocation } from "@remix-run/react";

import DefaultPhotoCourse from "~/assets/svgs/default-photo-course.svg";
import { CardBadge } from "~/components/CardBadge";
import CourseProgress from "~/components/CourseProgress";
import { Gravatar } from "~/components/Gravatar";
import { Icon } from "~/components/Icon";
import { Avatar } from "~/components/ui/avatar";
import { CategoryChip } from "~/components/ui/CategoryChip";
import { useUserRole } from "~/hooks/useUserRole";
import { cn } from "~/lib/utils";
import CourseCardButton from "~/modules/Dashboard/Courses/CourseCardButton";

import { CourseCardTitle } from "./CourseCardTitle";

import type { GetAllCoursesResponse } from "~/api/generated-api";

export type CourseCardProps = GetAllCoursesResponse["data"][number];

const CourseCard = ({
  author,
  authorEmail = "",
  category,
  completedChapterCount,
  courseChapterCount,
  currency,
  description,
  enrolled = false,
  hasFreeChapters,
  id,
  thumbnailUrl,
  priceInCents,
  title,
}: CourseCardProps) => {
  const { isAdmin } = useUserRole();
  const { pathname } = useLocation();
  const isScormCreatePage = pathname.includes("/admin/courses/new-scorm");

  return (
    <Link
      to={isScormCreatePage ? "#" : `/course/${id}`}
      className={cn(
        "flex flex-col w-full max-w-[320px] overflow-hidden rounded-lg transition hover:shadow-primary h-auto bg-white lg:bg-none border",
        {
          "border-secondary-200 hover:border-secondary-500": enrolled,
          "border-primary-200 hover:border-primary-500": !enrolled,
        },
      )}
    >
      <div className="relative">
        <img
          src={thumbnailUrl || DefaultPhotoCourse}
          alt="Course"
          loading="eager"
          decoding="async"
          className="w-full aspect-video object-cover rounded-t-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DefaultPhotoCourse;
          }}
        />
        <div className="absolute top-4 left-4 flex flex-col gap-y-1 right-4">
          <CategoryChip
            category={category}
            color={cn({
              "text-secondary-600": enrolled,
              "text-primary-700": isAdmin || !enrolled,
            })}
          />
          {hasFreeChapters && !enrolled && (
            <CardBadge variant="successFilled">
              <Icon name="FreeRight" className="w-4" />
              Free Lessons!
            </CardBadge>
          )}
        </div>
      </div>
      <div className={cn("flex flex-col flex-grow p-4")}>
        <div className="flex flex-col flex-grow">
          {enrolled && (
            <CourseProgress
              label="Course progress:"
              courseLessonCount={courseChapterCount}
              completedLessonCount={completedChapterCount}
            />
          )}
          <div className={cn({ "mt-3": author })}>
            <CourseCardTitle title={title} />
          </div>
          {authorEmail && (
            <div className="flex items-center gap-x-1.5 mt-1 mb-2">
              <Avatar className="h-4 w-4">
                <Gravatar email={authorEmail} />
              </Avatar>
              <span className="text-neutral-950">{author}</span>
            </div>
          )}
          <div className="text-neutral-500 text-sm flex-grow">
            <span className="line-clamp-3">
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </span>
          </div>
        </div>
        <div className="mt-4">
          <CourseCardButton
            currency={currency}
            enrolled={enrolled}
            isAdmin={isAdmin}
            priceInCents={priceInCents}
            isScormCreatePage={isScormCreatePage}
          />
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
