import { useParams } from "@remix-run/react";
import { useLessonSuspense } from "~/api/queries/useLesson";
import { Card, CardContent } from "~/components/ui/card";

export default function Overview() {
  const { lessonId } = useParams();
  const { data } = useLessonSuspense(lessonId!);

  const imageUrl = "https://placehold.co/320x180";
  const title = data.title;
  const description = data.description;
  const lessonNumber = 1;

  return (
    <Card className="w-full">
      <CardContent className="p-8 flex align-center gap-6">
        <div className="relative self-center">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-32 object-cover rounded-lg drop-shadow-sm"
          />
          <span className="absolute bottom-0 right-0 -translate-x-1/2 translate-y-1/2 bg-white rounded-full w-8 h-8 flex justify-center items-center text-primary-700">
            {lessonNumber}
          </span>
        </div>
        <div className="flex flex-col w-full">
          <div className="gap-2 flex flex-col">
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
          </div>
          <h5 className="h5 mt-6">{title}</h5>
          <div className="body-base">{description}</div>
        </div>
      </CardContent>
    </Card>
  );
}
