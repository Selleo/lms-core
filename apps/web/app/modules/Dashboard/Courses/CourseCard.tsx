import { Link } from "@remix-run/react";
import type { GetAllCoursesResponse } from "~/api/generated-api";
import CourseProgress from "~/components/CourseProgress";
import { CategoryChip } from "~/components/ui/CategoryChip";
import { useUserRole } from "~/hooks/useUserRole";
import { cn } from "~/lib/utils";
import CourseCardButton from "~/modules/Dashboard/Courses/CourseCardButton";
import { CourseCardTitle } from "./CourseCardTitle";

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
> & {
  href: string;
  completedLessonCount?: number;
};

const CourseCard = ({
  href,
  title,
  description,
  category,
  imageUrl,
  enrolled,
  courseLessonCount,
  completedLessonCount,
  priceInCents,
}: CourseCardProps) => {
  const { isAdmin } = useUserRole();

  return (
    <Link
      to={href}
      className="flex flex-col w-full max-w-[320px] overflow-hidden rounded-lg transition hover:shadow-primary h-full"
    >
      <div className="relative">
        <img
          src={imageUrl || "https://placehold.co/600x400/png"}
          alt="Course"
          className="w-full aspect-video object-cover rounded-t-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://picsum.photos/500/300";
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
      <div
        className={cn(
          "flex flex-col flex-grow border-x border-b rounded-b-lg p-4",
          {
            "border-secondary-200 hover:border-secondary-500": enrolled,
            "border-primary-200 hover:border-primary-500": !enrolled,
          }
        )}
      >
        <div className="flex flex-col gap-y-3 flex-grow">
          {enrolled && typeof completedLessonCount === "number" && (
            <CourseProgress
              courseLessonCount={courseLessonCount}
              completedLessonCount={completedLessonCount}
            />
          )}
          <CourseCardTitle title={title} />
          <div className="text-neutral-500 text-sm flex-grow">
            <span className="line-clamp-3">
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </span>
          </div>
        </div>
        <div className="mt-4">
          <CourseCardButton
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
