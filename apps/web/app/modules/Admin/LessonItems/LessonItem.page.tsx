import { useParams } from "@remix-run/react";
import { queryClient } from "~/api/queryClient";
import { TextBlockItem } from "./TextBlockItem";
import { QuestionItem } from "./QuestionItem";
import { FileItem } from "./FileItem";
import {
  lessonItemByIdQueryOptions,
  useLessonItemById,
} from "~/api/queries/admin/useLessonItemById";

const LessonItem = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("Lesson Item ID not found");

  const { data: lessonItem, isLoading } = useLessonItemById(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  if (!lessonItem) throw new Error("Lesson Item not found");

  const onUpdate = () => {
    queryClient.invalidateQueries(lessonItemByIdQueryOptions(id));
  };

  console.log({ lessonItemId: id });

  const renderLessonItem = () => {
    switch (lessonItem.itemType) {
      case "text_block":
        return (
          <TextBlockItem id={id} initialData={lessonItem} onUpdate={onUpdate} />
        );
      case "question":
        return (
          <QuestionItem id={id} initialData={lessonItem} onUpdate={onUpdate} />
        );
      case "file":
        return (
          <FileItem id={id} initialData={lessonItem} onUpdate={onUpdate} />
        );
      default:
        return <div>Unknown item type</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      {renderLessonItem()}
    </div>
  );
};

export default LessonItem;
