import { Link } from "@remix-run/react";
import { GetAllCoursesResponse } from "~/api/generated-api";
import { Button } from "~/components/ui/button";

type CourseType = GetAllCoursesResponse["data"][number];
type CourseCardProps = Pick<
  CourseType,
  "title" | "category" | "courseLessonCount" | "imageUrl"
> & {
  href: string;
};

const CourseCard = ({
  href,
  title,
  category,
  imageUrl,
}: CourseCardProps) => {
  return (
    <Link
      to={href}
      className="grid grid-rows-subgrid row-span-3 border border-primary-200 rounded-lg"
    >
      <img
        src={imageUrl || "https://placehold.co/600x400/png"}
        alt="Course"
        className="rounded-md aspect-video object-cover w-full"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "https://picsum.photos/500/300";
        }}
      />
      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-bold text-xl text-neutral-950 line-clamp-2">
          {title}
        </h3>
        <div className="text-details justify-end text-neutral-500 pb-4">
          <span className="line-clamp-2">{category}</span>
        </div>
        <Button className="w-full mt-auto">Enroll</Button>
      </div>
    </Link>
  );
};

export default CourseCard;
