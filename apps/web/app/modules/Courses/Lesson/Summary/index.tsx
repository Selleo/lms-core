import { Card, CardContent } from "~/components/ui/card";
import { getSummaryItems } from "../utils";
import { useLessonSuspense } from "~/api/queries/useLesson";
import { useParams } from "@remix-run/react";
import SingleLessonSummary from "./SingleLessonSummary";

export default function Summary() {
  const { lessonId } = useParams();
  const { data } = useLessonSuspense(lessonId ?? "");
  const lessonItemsCount = data.lessonItems.length;

  const lessonItemsSummary = getSummaryItems(data);

  return (
    <Card className="self-start w-full rounded-none w-[410px] lg:block hidden pb-32 fixed right-0 top-0 h-screen">
      <CardContent className="p-8 flex flex-col">
        <div className="h6">Lesson Summary</div>
        <div className="gap-2 flex flex-col mt-4 mb-8">
          <p className="text-neutral-600 text-xs">{`Lesson progress: 2/${lessonItemsCount}`}</p>
          <div className="flex justify-between items-center gap-px">
            {Array.from({ length: 2 }).map((_, index) => (
              <span
                key={index}
                className="h-[5px] flex-grow bg-secondary-500 rounded-[40px]"
              />
            ))}
            {Array.from({
              length: lessonItemsCount,
            }).map((_, idx) => (
              <span
                key={idx}
                className="h-[5px] flex-grow bg-primary-50 rounded-[40px]"
              />
            ))}
          </div>
          {lessonItemsSummary.map((lesson, index) => (
            <SingleLessonSummary
              key={lesson.id}
              lesson={lesson}
              isLast={index === lessonItemsSummary.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
