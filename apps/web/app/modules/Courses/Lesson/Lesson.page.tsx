import { useParams } from "@remix-run/react";
import { noop } from "lodash-es";

import { useCourse, useLesson } from "~/api/queries";
import { PageWrapper } from "~/components/PageWrapper";
import { LessonContent } from "~/modules/Courses/Lesson/LessonContent";
import { LessonSidebar } from "~/modules/Courses/Lesson/LessonSidebar";

export default function LessonPage() {
  const { courseId = "", lessonId = "" } = useParams();
  const { data: lesson } = useLesson(lessonId);
  const { data: course } = useCourse(courseId);

  if (!lesson || !course) return null;

  return (
    <PageWrapper className="max-w-full h-full">
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_480px] h-full max-w-full gap-6 w-full">
        <div className="w-full bg-white rounded-lg flex flex-col h-full divide-y">
          <div className="flex items-center py-6 px-12">
            <p className="h6 text-neutral-950">
              <span className="text-neutral-800">Chapter 1:</span> {course?.title}
            </p>
          </div>
          <LessonContent lesson={lesson} handlePrevious={() => noop} handleNext={() => noop} />
        </div>
        <LessonSidebar course={course} courseId={courseId} />
      </div>
    </PageWrapper>
  );
}
