import { Card, CardContent } from "~/components/ui/card";
import SingleLessonSummary from "./SingleLessonSummary";
import { useLessonSuspense } from "~/api/queries/useLesson";
import { useParams } from "@remix-run/react";
import { getSummaryItems } from "./utils";

export default function Summary() {
  const { lessonId } = useParams();
  const { data } = useLessonSuspense(lessonId!);
  console.log({ data });

  const lessonItemsSummary = getSummaryItems(data);
  console.log({ lessonItemsSummary });
  const LESSONS = [
    {
      title: "How to calculate everything?",
      isCompleted: true,
      id: "1",
    },
    {
      title: "How to cheat yourself?",
      isCompleted: false,
      id: "2",
    },
    {
      title: "Running and jumping?",
      isCompleted: true,
      id: "3",
    },
    {
      title: "What is the meaning of life?",
      isCompleted: true,
      id: "4",
    },
  ];

  return (
    <Card className="self-start w-full rounded-none max-w-[410px] mr-[-24px] mt-[-24px] lg:block hidden pb-32">
      <CardContent className="p-8 flex flex-col">
        <div className="h6">Lesson Summary</div>
        <div className="gap-2 flex flex-col mt-4 mb-8">
          <p className="text-neutral-600 text-xs">Lesson progress: 2/10</p>
          <div className="flex justify-between items-center gap-px">
            {Array.from({ length: 2 }).map((_, index) => (
              <span
                key={index}
                className="h-[5px] flex-grow bg-secondary-500 rounded-[40px]"
              />
            ))}
            {Array.from({
              length: 8,
            }).map((_, idx) => (
              <span
                key={idx}
                className="h-[5px] flex-grow bg-primary-50 rounded-[40px]"
              />
            ))}
          </div>
          {LESSONS.map((lesson, index) => (
            <SingleLessonSummary
              key={lesson.id}
              lesson={lesson}
              isLast={index === LESSONS.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
