import { useNavigate, useParams } from "@remix-run/react";

import { useCourse, useLesson } from "~/api/queries";
import { PageWrapper } from "~/components/PageWrapper";
import { LessonContent } from "~/modules/Courses/Lesson/LessonContent";
import { LessonSidebar } from "~/modules/Courses/Lesson/LessonSidebar";

import type { GetCourseResponse } from "~/api/generated-api";

export default function LessonPage() {
  const { courseId = "", lessonId = "" } = useParams();
  const { data: lesson } = useLesson(lessonId);
  const { data: course } = useCourse(courseId);
  const navigate = useNavigate();

  if (!lesson || !course) return null;

  const currentChapter = course.chapters.find((chapter) =>
    chapter?.lessons.some((l) => l.id === lessonId),
  );

  function findCurrentLessonIndex(
    lessons: GetCourseResponse["data"]["chapters"][number]["lessons"],
    currentLessonId: string,
  ) {
    return lessons.findIndex((lesson) => lesson.id === currentLessonId);
  }

  function handleNextLesson(
    currentLessonId: string,
    chapters: GetCourseResponse["data"]["chapters"],
  ) {
    for (const chapter of chapters) {
      const lessonIndex = findCurrentLessonIndex(chapter.lessons, currentLessonId);
      if (lessonIndex !== -1) {
        if (lessonIndex + 1 < chapter.lessons.length) {
          const nextLessonId = chapter.lessons[lessonIndex + 1].id;
          navigate(`/course/${courseId}/lesson/${nextLessonId}`);
        } else {
          const currentChapterIndex = chapters.indexOf(chapter);
          if (currentChapterIndex + 1 < chapters.length) {
            const nextChapterId = chapters[currentChapterIndex + 1].lessons[0].id;
            navigate(`/course/${courseId}/lesson/${nextChapterId}`);
          }
        }
      }
    }

    return null;
  }

  function handlePrevLesson(
    currentLessonId: string,
    chapters: GetCourseResponse["data"]["chapters"],
  ) {
    for (const chapter of chapters) {
      const lessonIndex = findCurrentLessonIndex(chapter.lessons, currentLessonId);
      if (lessonIndex !== -1) {
        if (lessonIndex > 0) {
          const prevLessonId = chapter.lessons[lessonIndex - 1].id;
          navigate(`/course/${courseId}/lesson/${prevLessonId}`);
        } else {
          const currentChapterIndex = chapters.indexOf(chapter);
          if (currentChapterIndex > 0) {
            const prevChapter = chapters[currentChapterIndex - 1];
            const prevChapterId = prevChapter.lessons[prevChapter.lessons.length - 1].id;

            navigate(`/course/${courseId}/lesson/${prevChapterId}`);
          }
        }
      }
    }

    return null;
  }

  return (
    <PageWrapper className="max-w-full h-full">
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_480px] h-full max-w-full gap-6 w-full">
        <div className="w-full bg-white rounded-lg flex flex-col h-full divide-y">
          <div className="flex items-center py-6 px-12">
            <p className="h6 text-neutral-950">
              <span className="text-neutral-800">Chapter {currentChapter?.displayOrder}:</span>{" "}
              {course?.title}
            </p>
          </div>
          <LessonContent
            lesson={lesson}
            lessonsAmount={currentChapter?.lessons.length ?? 0}
            handlePrevious={() => handlePrevLesson(lessonId, course.chapters)}
            handleNext={() => handleNextLesson(lessonId, course.chapters)}
          />
        </div>
        <LessonSidebar course={course} courseId={courseId} />
      </div>
    </PageWrapper>
  );
}
