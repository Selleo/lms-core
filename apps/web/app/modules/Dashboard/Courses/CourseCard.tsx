import { Link } from "@remix-run/react";
import { GetAllCoursesResponse } from "~/api/generated-api";
import { Button } from "~/components/ui/button";

type CourseType = GetAllCoursesResponse["data"][number];
type CourseCardProps = Pick<
  CourseType,
  "title" | "category" | "courseLessonCount"
> & {
  href: string;
};

const CourseCard = ({
  href,
  title,
  category,
  courseLessonCount,
}: CourseCardProps) => {
  return (
    <Link
      to={href}
      className="flex flex-col gap-y-2.5 max-w-[360px] border border-primary-200 rounded-lg justify-between h-min"
    >
      <img
        src="https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp"
        alt="Course"
        className="rounded-md"
      />
      <h3 className="font-bold text-xl text-neutral-950 truncate px-4">
        {title}
      </h3>
      <div className="flex justify-between p-4">
        <div className="flex flex-col text-details justify-end text-neutral-500">
          <span>{category}</span>
          <span>{courseLessonCount} lessons</span>
        </div>
        <Button>Enroll</Button>
      </div>
    </Link>
  );
};

export default CourseCard;
