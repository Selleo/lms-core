import { useCallback, useMemo, useState } from "react";

import { ButtonGroup } from "~/components/ButtonGroup/ButtonGroup";
import { useUserRole } from "~/hooks/useUserRole";
import { LessonCard } from "~/modules/Courses/CourseView/LessonCard";

import type { GetCourseResponse } from "~/api/generated-api";

type LessonsListProps = {
  lessons: GetCourseResponse["data"]["lessons"];
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

      const lessonsByType = lessons.filter((lesson) => lesson.type === type);

      setFilteredLessons(lessonsByType);
    },
    [lessons],
  );

  const lessonCards = useMemo(() => {
    return filteredLessons.map((item, index) => (
      <LessonCard
        {...item}
        key={item.id}
        index={index}
        isEnrolled={!!isEnrolled}
        isAdmin={isAdmin}
      />
    ));
  }, [filteredLessons, isAdmin, isEnrolled]);

  return (
    <div className="grow flex flex-col gap-y-4 rounded-2xl bg-white drop-shadow-primary relative p-6 lg:p-8">
      <h3 className="text-xl font-semibold">
        Lessons
        <span className="text-primary-700"> ({lessons.length})</span>
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
            children: "Lessons",
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
