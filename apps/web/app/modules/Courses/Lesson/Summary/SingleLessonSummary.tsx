import { cn } from "~/lib/utils";

type TProps = {
  lesson: {
    displayOrder: number | null;
    id: string;
    title: string;
    isCompleted: boolean;
  };
  isLast: boolean;
};

export default function SingleLessonSummary({ lesson, isLast }: TProps) {
  return (
    <div
      className={cn("flex items-center gap-2 py-4", {
        "border-b border-b-primary-200": !isLast,
      })}
    >
      <input checked={lesson.isCompleted} className="min-w-6 min-h-6" readOnly type="radio" />
      <div className="body-base-md" dangerouslySetInnerHTML={{ __html: lesson.title }} />
    </div>
  );
}
