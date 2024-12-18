import { useCallback, useMemo, useState } from "react";

import { ButtonGroup } from "~/components/ButtonGroup/ButtonGroup";
import { useUserRole } from "~/hooks/useUserRole";
import { ChapterCard } from "~/modules/Courses/CourseView/ChapterCard";

import type { GetCourseResponse } from "~/api/generated-api";

type LessonsListProps = {
  lessons: GetCourseResponse["data"]["chapters"];
  isEnrolled: GetCourseResponse["data"]["enrolled"];
};

type LessonType = "quiz" | "multimedia";

export const LessonsList = ({ lessons, isEnrolled }: LessonsListProps) => {
  const [filteredLessons, setFilteredLessons] = useState(lessons);
  const [activeButton, setActiveButton] = useState<LessonType | null>(null);

  const { isAdmin } = useUserRole();

  const handleChangeLessonType = useCallback(
    (type: LessonType | null) => {
      setActiveButton(type);

      if (!type) return setFilteredLessons(lessons);

      setFilteredLessons(lessons);
    },
    [lessons],
  );

  const lessonCards = useMemo(() => {
    return filteredLessons?.map((lesson, index) => (
      <ChapterCard
        {...lesson}
        key={lesson.id}
        index={index}
        isEnrolled={!!isEnrolled}
        isAdmin={isAdmin}
      />
    ));
  }, [filteredLessons, isAdmin, isEnrolled]);

  return (
    <div className="grow flex flex-col gap-y-4 rounded-2xl bg-white drop-shadow-primary relative p-6 lg:p-8">
      <h3 className="text-xl font-semibold">
        Chapters
        <span className="text-primary-700"> ({lessons?.length})</span>
      </h3>
      <ButtonGroup
        className="sr-only lg:not-sr-only"
        buttons={[
          {
            children: "All",
            isActive: !activeButton,
            onClick: () => handleChangeLessonType(null),
          },
          {
            children: "Chapters",
            isActive: activeButton === "multimedia",
            onClick: () => handleChangeLessonType("multimedia"),
          },
          {
            children: "Quizzes",
            isActive: activeButton === "quiz",
            onClick: () => handleChangeLessonType("quiz"),
          },
        ]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-4 overflow-auto min-h-0 scrollbar-thin">
        {lessonCards}
      </div>
    </div>
  );
};
