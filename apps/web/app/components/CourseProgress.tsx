import { cn } from "~/lib/utils";

type CourseProgressProps = {
  completedLessonCount: number;
  courseLessonCount: number;
};

const CourseProgress = ({
  completedLessonCount,
  courseLessonCount,
}: CourseProgressProps) => {
  const getCourseProgressParts = () => {
    return Array.from({ length: courseLessonCount }).map((_, index) => (
      <span
        key={index}
        className={cn("h-[5px] flex-grow rounded-[40px]", {
          "bg-secondary-500": index < completedLessonCount,
          "bg-primary-50":
            index > completedLessonCount || completedLessonCount === 0,
        })}
      />
    ));
  };

  const courseProgressParts = getCourseProgressParts();

  return (
    <div className="gap-2 flex flex-col">
      <p className="text-neutral-600 text-xs">{`Lesson progress: ${completedLessonCount}/${courseLessonCount}`}</p>
      <div className="flex justify-between items-center gap-px">
        {courseProgressParts}
      </div>
    </div>
  );
};

export default CourseProgress;
