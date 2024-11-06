import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Controller, useWatch } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import type { SortableAnswerOptionProps } from "./types";
import type { UpdateQuestionItemBody } from "~/api/generated-api";

export const SortableAnswerOption = ({
  id,
  index,
  isEditing,
  control,
  onRemove,
}: SortableAnswerOptionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const questionAnswers = useWatch({
    control,
    name: "questionAnswers",
    defaultValue: [],
  }) as UpdateQuestionItemBody["questionAnswers"];

  if (!questionAnswers || questionAnswers.length === 0) {
    return null;
  }

  const currentAnswer = questionAnswers[index];
  const isCorrect = currentAnswer?.isCorrect ?? false;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center space-x-2 p-2 bg-white rounded-md ${
        isEditing ? "border border-gray-200" : ""
      }`}
    >
      {isEditing && (
        <button type="button" className="cursor-grab touch-none" {...attributes} {...listeners}>
          <GripVertical className="h-5 w-5 text-gray-400" />
        </button>
      )}
      <div className="flex-1 flex items-center space-x-2">
        {!isEditing ? (
          <>
            <span className="flex-1 font-semibold">
              <Controller
                name={`questionAnswers.${index}.optionText`}
                control={control}
                render={({ field }) => <span>{field.value}</span>}
              />
            </span>
            <span className={`text-sm ${isCorrect ? "text-green-600" : "text-red-600"}`}>
              {isCorrect ? "Correct" : "Incorrect"}
            </span>
          </>
        ) : (
          <>
            <Controller
              name={`questionAnswers.${index}.optionText`}
              control={control}
              render={({ field }) => <Input {...field} placeholder="Enter answer option" />}
            />
            <Controller
              name={`questionAnswers.${index}.isCorrect`}
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`isCorrect-${index}`}>Correct</Label>
                  <Checkbox
                    id={`isCorrect-${index}`}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
            <Button type="button" variant="destructive" onClick={onRemove}>
              Remove
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
