import CourseCard from "./CourseCard";

import type { GetAvailableCoursesResponse } from "~/api/generated-api";

type CardCourseListProps = {
  availableCourses?: GetAvailableCoursesResponse["data"];
};

export const CardCourseList = ({ availableCourses }: CardCourseListProps) => {
  return (
    <div className="flex gap-6 flex-wrap *:h-auto">
      {availableCourses &&
        availableCourses.map((course) => {
          if (course.enrolled) return null;

          return <CourseCard {...course} key={course.id} />;
        })}
    </div>
  );
};
