import CourseCard from "./CourseCard";

import type { GetAvailableCoursesResponse } from "~/api/generated-api";

type CardCourseListProps = {
  availableCourses?: GetAvailableCoursesResponse["data"];
};

export const CardCourseList = ({ availableCourses }: CardCourseListProps) => {
  return (
    <div className="flex gap-6 flex-wrap *:h-auto">
      {availableCourses &&
        availableCourses.map(
          ({
            authorEmail,
            author,
            title,
            category,
            description,
            courseLessonCount,
            id,
            imageUrl,
            enrolled,
            priceInCents,
            currency,
          }) => {
            if (!enrolled) {
              return (
                <CourseCard
                  author={author}
                  authorEmail={authorEmail}
                  key={id}
                  title={title}
                  imageUrl={imageUrl}
                  description={description}
                  href={`/course/${id}`}
                  category={category}
                  courseLessonCount={courseLessonCount}
                  enrolled={enrolled}
                  priceInCents={priceInCents}
                  currency={currency}
                  withAuthor
                />
              );
            }

            return null;
          },
        )}
    </div>
  );
};
