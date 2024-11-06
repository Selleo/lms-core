import { useParams } from "@remix-run/react";

import {
  lessonItemByIdQueryOptions,
  useLessonItemById,
} from "~/api/queries/admin/useLessonItemById";
import { queryClient } from "~/api/queryClient";

import { FileItem } from "./FileItem";
import { QuestionItem } from "./QuestionItem";
import { TextBlockItem } from "./TextBlockItem";

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

  const renderLessonItem = () => {
    switch (lessonItem.itemType) {
      case "text_block":
        return <TextBlockItem id={id} initialData={lessonItem} onUpdate={onUpdate} />;
      case "question":
        return <QuestionItem id={id} initialData={lessonItem} onUpdate={onUpdate} />;
      case "file":
        return <FileItem id={id} initialData={lessonItem} onUpdate={onUpdate} />;
      default:
        return <div>Unknown item type</div>;
    }
  };

  return <div className="p-6 mx-auto">{renderLessonItem()}</div>;
};

export default LessonItem;
