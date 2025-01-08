import { useNavigate } from "@remix-run/react";
import { find, flatMap } from "lodash-es";

import { CopyUrlButton } from "~/components/CopyUrlButton";
import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { CourseProgressChart } from "~/modules/Courses/CourseView/components/CourseProgressChart";

import type { GetCourseResponse } from "~/api/generated-api";
import { useTranslation } from "react-i18next";

type CourseProgressProps = {
  course: GetCourseResponse["data"];
};

const findFirstNotStartedLessonId = (course: CourseProgressProps["course"]) => {
  const allLessons = flatMap(course.chapters, (chapter) => chapter.lessons);
  return find(allLessons, (lesson) => lesson.status === "not_started")?.id;
};

export const CourseProgress = ({ course }: CourseProgressProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const nonStartedLessonId = findFirstNotStartedLessonId(course);
  const notStartedChapterId = course.chapters.find((chapter) => {
    return chapter.lessons.some((lesson) => lesson.id === nonStartedLessonId);
  })?.id;

  return (
    <>
      <h4 className="h6 text-neutral-950 pb-1">{t('studentCourseView.sideSection.other.courseProgress')}</h4>
      <CourseProgressChart
        chaptersCount={course?.courseChapterCount}
        completedChaptersCount={course?.completedChapterCount}
      />
      <div className="flex flex-col gap-y-2">
        <CopyUrlButton className="gap-x-2" variant="outline">
          <Icon name="Share" className="w-6 h-auto text-primary-800" />
          <span>{t('studentCourseView.sideSection.button.shareCourse')}</span>
        </CopyUrlButton>
        <Button
          className="gap-x-2"
          disabled={!nonStartedLessonId}
          onClick={() =>
            navigate(`lesson/${nonStartedLessonId}`, {
              state: { chapterId: notStartedChapterId },
            })
          }
        >
          <Icon name="Play" className="w-6 h-auto text-white" />
          <span>{t('studentCourseView.sideSection.button.continueLearning')}</span>
        </Button>
        <p className="text-neutral-800 details flex items-center justify-center gap-x-2">
          <Icon name="Info" className="w-4 h-auto text-neutral-800" />
          <span>{t('studentCourseView.sideSection.other.informationText')}</span>
        </p>
      </div>
    </>
  );
};
