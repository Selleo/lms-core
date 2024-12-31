import { useNavigate } from "@remix-run/react";
import { find, flatMap } from "lodash-es";

import { CopyUrlButton } from "~/components/CopyUrlButton";
import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { CourseProgressChart } from "~/modules/Courses/NewCourseView/components/CourseProgressChart";

import type { GetCourseResponse } from "~/api/generated-api";

type CourseProgressProps = {
  course: GetCourseResponse["data"];
};

const findFirstNotStartedLessonId = (course: CourseProgressProps["course"]) => {
  const allLessons = flatMap(course.chapters, (chapter) => chapter.lessons);
  return find(allLessons, (lesson) => lesson.status === "not_started")?.id;
};

export const CourseProgress = ({ course }: CourseProgressProps) => {
  const navigate = useNavigate();
  const nonStartedLessonId = findFirstNotStartedLessonId(course);

  return (
    <>
      <h4 className="h6 text-neutral-950 pb-1">Course progress</h4>
      <CourseProgressChart
        chaptersCount={course?.courseChapterCount}
        completedChaptersCount={course?.completedChapterCount}
      />
      <div className="flex flex-col gap-y-2">
        <CopyUrlButton className="gap-x-2" variant="outline">
          <Icon name="Share" className="w-6 h-auto text-primary-800" />
          <span>Share this course</span>
        </CopyUrlButton>
        <Button
          className="gap-x-2"
          disabled={!nonStartedLessonId}
          onClick={() => navigate(`lesson/${nonStartedLessonId}`)}
        >
          <Icon name="Play" className="w-6 h-auto text-white" />
          <span>Continue learning</span>
        </Button>
        <p className="text-neutral-800 details flex items-center justify-center gap-x-2">
          <Icon name="Info" className="w-4 h-auto text-neutral-800" />
          <span>Quickly pick up where you left off with your most recent lesson.</span>
        </p>
      </div>
    </>
  );
};
