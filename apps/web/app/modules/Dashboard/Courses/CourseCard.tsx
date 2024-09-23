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
  courseLessonCount,
}: CourseCardProps) => {
  return (
    <Link
      to={href}
      className="flex flex-col gap-y-2.5 max-w-[360px] border border-primary-200 rounded-lg justify-between h-min"
    >
      <img
        src={imageUrl || "https://placehold.co/600x400"}
        alt="Course"
        className="rounded-md aspect-auto"
      />
      <h3 className="font-bold text-xl text-neutral-950 truncate px-4">
        {title}
      </h3>
      <div className="flex justify-between p-4">
        <div className="flex flex-col text-details justify-end text-neutral-500 w-2/3">
          <span className="truncate">{category}</span>
          <span>{courseLessonCount} lessons</span>
        </div>
        <Button>Enroll</Button>
      </div>
    </Link>
  );
};

export default CourseCard;
