import { useParams } from "@remix-run/react";

import { useLessonSuspense } from "~/api/queries/useLesson";
import CourseProgress from "~/components/CourseProgress";
import { Card, CardContent } from "~/components/ui/card";
import { QuizSummary } from "~/modules/Courses/Lesson/Summary/QuizSummary";
import SingleLessonSummary from "~/modules/Courses/Lesson/Summary/SingleLessonSummary";

import { getSummaryItems } from "../utils";

export default function Summary() {
  const { lessonId = "", courseId = "" } = useParams();
  const { data } = useLessonSuspense(lessonId, courseId);

  const isQuiz = data.type === "quiz";

  const lessonItemsCount = data.itemsCount;
  const lessonItemsCompletedCount = data.itemsCompletedCount ?? 0;

  const lessonItemsSummary = getSummaryItems(data);

  return (
    <Card className="sr-only lg:not-sr-only rounded-none max-w-[383px] w-full flex flex-col grow border-none drop-shadow-primary">
      {isQuiz && <QuizSummary data={data} lessonId={lessonId ?? ""} courseId={courseId ?? ""} />}
      {!isQuiz && (
        <CardContent className="p-8 flex flex-col">
          <div className="h6">Lesson Summary</div>
          <div className="gap-2 flex flex-col mt-4 mb-8">
            <CourseProgress
              label="Lesson progress:"
              completedLessonCount={lessonItemsCompletedCount}
              courseLessonCount={lessonItemsCount}
            />
            {lessonItemsSummary.map((lesson, index) => (
              <SingleLessonSummary
                key={lesson.id}
                lesson={lesson}
                isLast={index === lessonItemsSummary.length - 1}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
