import { cn } from "~/lib/utils";

type TProps = {
  lesson: {
    displayOrder: number | null;
    id: string;
    title: string;
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
        checked={false}
        className="min-w-6 min-h-6"
        readOnly
        type="radio"
      />
      <p className="body-base-md">{lesson.title}</p>
    </div>
  );
}
