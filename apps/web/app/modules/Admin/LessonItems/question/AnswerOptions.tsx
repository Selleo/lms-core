import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Control, UseFieldArrayReturn } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { SortableAnswerOption } from "./SortableAnswerOption";
import { UpdateQuestionItemBody } from "~/api/generated-api";

interface AnswerOptionsProps {
  questionType?: string;
  isEditing: boolean;
  control: Control<UpdateQuestionItemBody>;
  fieldArray: UseFieldArrayReturn<UpdateQuestionItemBody, "questionAnswers">;
  id: string;
}

export const AnswerOptions = ({
  questionType,
  isEditing,
  control,
  fieldArray: { fields, append, remove, replace },
  id,
}: AnswerOptionsProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      const newFields = arrayMove(fields, oldIndex, newIndex).map(
        (field, index) => ({
          ...field,
          position: index,
        })
      );

      replace(newFields);
    }
  };

  if (
    questionType !== "single_choice" &&
    questionType !== "multiple_choice" &&
    questionType !== "fill_in_the_blanks_text"
  ) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Label>Answer Options</Label>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {fields.map((field, index) => (
              <SortableAnswerOption
                key={field.id}
                id={field.id}
                index={index}
                isEditing={isEditing}
                control={control}
                onRemove={() => remove(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {isEditing && (
        <Button
          type="button"
          onClick={() =>
            append({
              optionText: "",
              position: fields.length,
              isCorrect: false,
              questionId: id,
            })
          }
        >
          Add Option
        </Button>
      )}
    </div>
  );
};
