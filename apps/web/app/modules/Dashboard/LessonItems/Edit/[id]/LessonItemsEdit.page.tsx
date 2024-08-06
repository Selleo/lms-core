import { useParams } from "@remix-run/react";
import { EditForm } from "../../components/EditForm/EditForm";
import { useLessonItems } from "~/modules/Dashboard/LessonItemsContext";

export default function LessonItemsEditPage() {
  const { lessonItems } = useLessonItems();
  const { id } = useParams<{ id: string }>();
  if (!id || !lessonItems.find((item) => item.id === id)) {
    return <div>Error: ID not found</div>;
  }
  return (
    <div>
      <h1>Edit Lesson Item</h1>
      <EditForm editId={id} />
    </div>
  );
}
