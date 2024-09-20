import { Dot } from "lucide-react";
import { Button } from "~/components/ui/button";
import { GetCourseResponse } from "~/api/generated-api";
import { noop } from "lodash-es";

export const CourseViewMainCard = ({
  course,
}: {
  course: GetCourseResponse["data"];
}) => {
  const {
    category,
    description,
    imageUrl,
    title,
    enrolled: isEnrolled,
    courseLessonCount,
  } = course;

  const COMPLETED_LESSONS_COUNT = 2; // TODO: Replace with actual count when available

  return (
    <div className="md:w-[480px] shrink-0 flex flex-col rounded-2xl bg-white drop-shadow-xl relative">
      <div className="absolute top-0 left-0 bg-white px-2 py-1 rounded-lg translate-x-4 translate-y-4 flex">
        <Dot className="fill-blue-700" />
        <span>{category}</span>
      </div>
      <img
        src={
          imageUrl ||
          "https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp"
        }
        alt="Course"
        className="w-full object-cover aspect-video object-center rounded-2xl"
      />
      <div className="flex flex-col h-full bg-white p-8 rounded-b-2xl min-h-0">
        <div className="gap-2 flex flex-col">
          <p className="text-neutral-600 text-xs">
            Course progress: 2/{courseLessonCount}
          </p>
          <div className="flex grow items-center gap-px">
            {Array.from({ length: COMPLETED_LESSONS_COUNT }).map((_, index) => (
              <span
                key={index}
                className="h-[5px] grow bg-secondary-500 rounded-[40px]"
              />
            ))}
            {Array.from({
              length: courseLessonCount - COMPLETED_LESSONS_COUNT,
            }).map((_, index) => (
              <span
                key={index}
                className="h-[5px] grow bg-primary-50 rounded-[40px]"
              />
            ))}
          </div>
        </div>
        <h2 className="text-2xl font-bold mt-6">{title}</h2>
        <div className="min-h-0 overflow-auto">
          <p className="mt-4 text-gray-600">{description}</p>
        </div>
        <div className="mt-auto">
          <Button
            onClick={noop} // TODO: Add enrollment logic
            className="mt-4 w-full bg-secondary-500 text-white py-2 rounded-lg"
          >
            {isEnrolled ? "Continue" : "Enroll"}
          </Button>
          {isEnrolled && (
            <Button
              className="bg-white border border-neutral-500 text-neutral-900 w-full mt-2"
              onClick={noop} // TODO: Add unenrollment logic
            >
              Unenroll
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
