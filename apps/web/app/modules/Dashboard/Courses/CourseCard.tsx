import { Link } from "@remix-run/react";
import type { GetAllCoursesResponse } from "~/api/generated-api";
import CourseProgress from "~/components/CourseProgress";
import { CategoryChip } from "~/components/ui/CategoryChip";
import { useUserRole } from "~/hooks/useUserRole";
import { cn } from "~/lib/utils";
import CourseCardButton from "~/modules/Dashboard/Courses/CourseCardButton";

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
      className="relative max-w-[320px] overflow-hidden w-full transition rounded-lg"
    >
      <div className="absolute top-4 left-4 right-4 flex">
        <CategoryChip
          category={category}
          color={cn({
            "text-secondary-600": enrolled,
            "text-primary-700": isAdmin || !enrolled,
          })}
        />
      </div>
      <img
        src={imageUrl || "https://placehold.co/600x400/png"}
        alt="Course"
        className="rounded-t-lg aspect-video object-cover min-w-[calc(100%+2px)] mt-[-1px] mx-[-1px]"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "https://picsum.photos/500/300";
        }}
      />
      <div
        className={cn(
          "flex flex-col border-x border-b rounded-b-lg max-w-[320px] gap-y-2 py-4 px-2 w-full h-auto aspect-[291/212]",
          {
            "border-secondary-200 hover:border-secondary-500": enrolled,
            "border-primary-200 hover:border-primary-500": !enrolled,
          }
        )}
      >
        <div className="flex flex-col gap-y-3">
          {enrolled && typeof completedLessonCount === "number" && (
            <CourseProgress
              courseLessonCount={courseLessonCount}
              completedLessonCount={completedLessonCount}
            />
          )}
          <div
            className={cn("flex flex-col gap-y-3", {
              "pt-3 pb-2 px-4": !enrolled,
            })}
          >
            <h3 className="font-bold leading-5 text-lg text-neutral-950 line-clamp-2">
              {title}
            </h3>
            <div className="justify-end text-neutral-500 text-sm">
              <span className="line-clamp-3">
                <div dangerouslySetInnerHTML={{ __html: description }} />
              </span>
            </div>
          </div>
        </div>
        <CourseCardButton
          enrolled={enrolled}
          isAdmin={isAdmin}
          priceInCents={priceInCents}
        />
      </div>
    </Link>
  );
};

export default CourseCard;
