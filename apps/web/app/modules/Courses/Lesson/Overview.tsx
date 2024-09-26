import { useParams } from "@remix-run/react";
import { useLessonSuspense } from "~/api/queries/useLesson";
import { Card, CardContent } from "~/components/ui/card";

export default function Overview() {
  const { lessonId } = useParams();
  const { data } = useLessonSuspense(lessonId ?? "");

  const imageUrl = data.imageUrl ?? "https://placehold.co/320x180";
  const title = data.title;
  const description = data.description;
  const lessonItemsCount = data.lessonItems.length;

  return (
    <Card className="w-full">
      <CardContent className="p-8 flex align-center gap-6">
        <div className="relative self-center w-[320px] aspect-video shrink-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover rounded-lg drop-shadow-sm"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="gap-2 flex flex-col">
            <p className="text-neutral-600 text-xs">
              {`Lesson progress: 2/${lessonItemsCount}`}
            </p>
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
          </div>
          <h5 className="h5 mt-6">{title}</h5>
          <div className="body-base">{description}</div>
        </div>
      </CardContent>
    </Card>
  );
}
