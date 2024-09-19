import { cn } from "~/lib/utils";

type TProps = {
  lesson: {
    title: string;
    isCompleted: boolean;
    id: string;
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
      <input
        checked={lesson.isCompleted}
        className="w-6 h-6"
        readOnly
        type="radio"
      />
      <p className="body-base-md">{lesson.title}</p>
    </div>
  );
}
