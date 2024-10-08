import { GetAvailableCoursesResponse } from "~/api/generated-api";
import CourseCard from "./CourseCard";

type CardCourseListProps = {
  availableCourses?: GetAvailableCoursesResponse["data"];
};

export const CardCourseList = ({ availableCourses }: CardCourseListProps) => {
  return (
    <>
      {availableCourses &&
        availableCourses.map(
          ({
            title,
            category,
            description,
            courseLessonCount,
            id,
            imageUrl,
            enrolled,
            priceInCents,
          }) => {
            if (!enrolled) {
              return (
                <CourseCard
                  key={id}
                  title={title}
                  imageUrl={imageUrl}
                  description={description}
                  href={`/course/${id}`}
                  category={category}
                  courseLessonCount={courseLessonCount}
                  enrolled={enrolled}
                  priceInCents={priceInCents}
                />
              );
            }

            return null;
          }
        )}
    </>
  );
};
