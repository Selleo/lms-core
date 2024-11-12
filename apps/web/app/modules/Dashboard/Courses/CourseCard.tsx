import { Link } from "@remix-run/react";

import CourseProgress from "~/components/CourseProgress";
import { Gravatar } from "~/components/Gravatar";
import { Avatar } from "~/components/ui/avatar";
import { CategoryChip } from "~/components/ui/CategoryChip";
import { useUserRole } from "~/hooks/useUserRole";
import { cn } from "~/lib/utils";
import CourseCardButton from "~/modules/Dashboard/Courses/CourseCardButton";

import { CourseCardTitle } from "./CourseCardTitle";

import type { GetAllCoursesResponse } from "~/api/generated-api";

type CourseType = GetAllCoursesResponse["data"][number];
type CourseCardProps = Pick<
  CourseType,
  | "title"
  | "category"
  | "courseLessonCount"
  | "imageUrl"
  | "description"
  | "enrolled"
  | "priceInCents"
  | "currency"
  | "author"
  | "authorEmail"
> & {
  href: string;
  completedLessonCount?: number;
  withAuthor?: boolean;
};

const CourseCard = ({
  href,
  title,
  description,
  category,
  imageUrl,
  enrolled = false,
  courseLessonCount,
  completedLessonCount,
  currency,
  priceInCents,
  withAuthor = false,
  author,
  authorEmail = "",
}: CourseCardProps) => {
  const { isAdmin } = useUserRole();

  return (
    <Link
      to={href}
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
          src={imageUrl || "https://placehold.co/600x400/png"}
          alt="Course"
          className="w-full aspect-video object-cover rounded-t-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://picsum.photos/500/300";
          }}
        />
        <div className="absolute top-4 left-4 right-4">
          <CategoryChip
            category={category}
            color={cn({
              "text-secondary-600": enrolled,
              "text-primary-700": isAdmin || !enrolled,
            })}
          />
        </div>
      </div>
      <div className={cn("flex flex-col flex-grow p-4")}>
        <div className={cn("flex flex-col flex-grow", { "gap-y-3": !withAuthor })}>
          {enrolled && typeof completedLessonCount === "number" && (
            <CourseProgress
              label="Course progress:"
              courseLessonCount={courseLessonCount}
              completedLessonCount={completedLessonCount}
            />
          )}
          <div className={cn({ "mt-3": withAuthor })}>
            <CourseCardTitle title={title} />
          </div>
          {withAuthor && (
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
          />
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
