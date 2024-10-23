import { useParams } from "@remix-run/react";
import { useLessonSuspense } from "~/api/queries/useLesson";
import { Card, CardContent } from "~/components/ui/card";

export default function Overview() {
  const { lessonId } = useParams();
  const { data } = useLessonSuspense(lessonId ?? "");

  const imageUrl = data.imageUrl ?? "https://placehold.co/320x180";
  const title = data.title;
  const description = data.description;
  const lessonItemsCount = data.itemsCount;
  const lessonItemsCompletedCount = data.itemsCompletedCount ?? 0;

  return (
    <Card className="w-full pt-6 border-none drop-shadow-primary">
      <CardContent className="lg:p-8 flex flex-col align-center gap-6 2xl:flex-row">
        <div className="relative self-center w-full lg:w-[320px] aspect-video">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-lg drop-shadow-sm"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="gap-2 flex flex-col">
            <p className="text-neutral-600 text-xs">
              {`Lesson progress: ${lessonItemsCompletedCount}/${lessonItemsCount}`}
            </p>
            <div className="flex justify-between items-center gap-px">
              {Array.from({
                length: lessonItemsCompletedCount,
              }).map((_, index) => (
                <span
                  key={index}
                  className="h-[5px] flex-grow bg-secondary-500 rounded-[40px]"
                />
              ))}
              {Array.from({
                length: lessonItemsCount - lessonItemsCompletedCount,
              }).map((_, index) => (
                <span
                  key={index}
                  className="h-[5px] flex-grow bg-primary-50 rounded-[40px]"
                />
              ))}
            </div>
          </div>
          <h5 className="h5 mt-6">{title}</h5>
          <div className="body-base">{description}</div>
        </div>
      </CardContent>
    </Card>
  );
}
