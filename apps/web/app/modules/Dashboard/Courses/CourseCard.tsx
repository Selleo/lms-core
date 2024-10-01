import { Link } from "@remix-run/react";
import { GetAllCoursesResponse } from "~/api/generated-api";
import { Button } from "~/components/ui/button";
import { CategoryChip } from "~/components/ui/CategoryChip";

type CourseType = GetAllCoursesResponse["data"][number];
type CourseCardProps = Pick<
  CourseType,
  "title" | "category" | "courseLessonCount" | "imageUrl" | "description"
> & {
  href: string;
};

const CourseCard = ({
  href,
  title,
  description,
  category,
  imageUrl,
}: CourseCardProps) => {
  return (
    <Link
      to={href}
      className="relative border border-primary-200 hover:border-primary-500 transition rounded-lg"
    >
      <div className="absolute top-4 left-4 right-4 flex">
        <CategoryChip category={category} />
      </div>
      <img
        src={imageUrl || "https://placehold.co/600x400/png"}
        alt="Course"
        className="rounded-t-lg aspect-video object-cover min-w-[calc(100%+2px)] mt-[-1px] mx-[-1px]"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "https://picsum.photos/500/300";
        }}
      />
      <div className="flex flex-col gap-3 p-4 pt-5 w-full aspect-[291/212]">
        <h3 className="font-bold leading-5 text-lg text-neutral-950 line-clamp-2">
          {title}
        </h3>
        <div className="justify-end text-neutral-500 text-sm">
          <span className="line-clamp-3">
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </span>
        </div>
        <Button className="w-full mt-auto">Enroll</Button>
      </div>
    </Link>
  );
};

export default CourseCard;
