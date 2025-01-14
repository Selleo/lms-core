import { ProgressBadge } from "~/components/Badges/ProgressBadge";
import { Icon } from "~/components/Icon";
import { LessonTypes, LessonTypesIcons } from "~/modules/Courses/CourseView/lessonTypes";

import type { GetCourseResponse } from "~/api/generated-api";

const progressBadge = {
  completed: "completed",
  in_progress: "inProgress",
  not_started: "notStarted",
} as const;

type Lesson = GetCourseResponse["data"]["chapters"][number]["lessons"][number];

type CourseChapterLessonProps = {
  lesson: Lesson;
};

export const CourseChapterLesson = ({ lesson }: CourseChapterLessonProps) => {
  return (
    <div className="flex gap-x-2 w-full p-2">
      <Icon name={LessonTypesIcons[lesson.type]} className="size-6 text-primary-700" />
      <div className="flex flex-col justify-center w-full">
        <p className="body-sm-md text-neutral-950">
          {lesson.title}{" "}
          <span className="text-neutral-800">
            {lesson.quizQuestionCount ? `(${lesson.quizQuestionCount})` : null}
          </span>
        </p>
        <span className="text-neutral-800 details">{LessonTypes[lesson.type]}</span>
      </div>
      <ProgressBadge progress={progressBadge[lesson.status]} className="self-center" />
    </div>
  );
};
