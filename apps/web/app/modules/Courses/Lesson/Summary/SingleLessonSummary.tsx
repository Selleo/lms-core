import { cn } from "~/lib/utils";

import { useCompletedLessonItemsStore } from "../LessonItems/LessonItemStore";

type TProps = {
  lesson: {
    displayOrder: number | null;
    id: string;
    title: string;
  };
  isLast: boolean;
};

export default function SingleLessonSummary({ lesson, isLast }: TProps) {
  const { isLessonItemCompleted } = useCompletedLessonItemsStore();

  return (
    <div
      className={cn("flex items-center gap-2 py-4", {
        "border-b border-b-primary-200": !isLast,
      })}
    >
      <input
        checked={isLessonItemCompleted(lesson.id)}
        className="min-w-6 min-h-6"
        readOnly
        type="radio"
      />
      <div className="body-base-md" dangerouslySetInnerHTML={{ __html: lesson.title }} />
    </div>
  );
}
