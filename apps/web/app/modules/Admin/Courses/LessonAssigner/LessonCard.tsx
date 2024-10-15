import { GetAllLessonsResponse } from "~/api/generated-api";

type TransformedLesson = GetAllLessonsResponse["data"][number] & {
  columnId: string;
};

interface LessonCardProps {
  lesson: TransformedLesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  return (
    <div className="bg-white p-2 mb-2 rounded shadow flex items-center gap-2">
      <img src={lesson.imageUrl} alt="" className="w-16 h-16 rounded-md" />
      <div>
        <h4 className="font-medium">{lesson.title}</h4>
        <p className="text-sm text-gray-600 line-clamp-4">
          {lesson.description}
        </p>
      </div>
    </div>
  );
}
