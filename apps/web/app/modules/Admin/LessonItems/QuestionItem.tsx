import React, { useState, useEffect } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { capitalize, startCase } from "lodash-es";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useUpdateQuestionItem } from "~/api/mutations/admin/useUpdateQuestionItem";
import { UpdateQuestionItemBody } from "~/api/generated-api";

interface QuestionItemProps {
  id: string;
  initialData: {
    questionType: string;
    questionBody: string;
    state: string;
    questionAnswers?: {
      id: string;
      optionText: string;
      position: number | null;
      isStudentAnswer: boolean;
    }[];
    solutionExplanation: string | null;
  };
  onUpdate: () => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  id,
  initialData,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: updateQuestionItem } = useUpdateQuestionItem();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm<UpdateQuestionItemBody>({
    defaultValues: initialData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questionAnswers",
  });

  const questionType = watch("questionType");

  useEffect(() => {
    if (questionType === "open_answer") {
      remove();
    }
  }, [questionType, remove]);

  const onSubmit = (data: UpdateQuestionItemBody) => {
    console.log({ data });
    updateQuestionItem({ data, questionId: id }).then(() => {
      onUpdate();
      setIsEditing(false);
    });
  };

  const renderField = (name: keyof UpdateQuestionItemBody) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        if (!isEditing) {
          if (name === "questionType") {
            return (
              <span className="font-semibold">
                {capitalize(startCase(field.value as string))}
              </span>
            );
          }
          return <span className="font-semibold">{field.value as string}</span>;
        }

        if (name === "questionType") {
          return (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value as string}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a question type" />
              </SelectTrigger>
              <SelectContent>
                {["single_choice", "multiple_choice", "open_answer"].map(
                  (type) => (
                    <SelectItem value={type} key={type}>
                      {capitalize(startCase(type))}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          );
        }

        if (name === "state") {
          return (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value as string}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {["draft", "published"].map((state) => (
                  <SelectItem value={state} key={state}>
                    {capitalize(state)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        if (name === "questionBody" || name === "solutionExplanation") {
          return (
            <Textarea
              {...field}
              value={field.value as string}
              placeholder={`Enter ${startCase(name)}`}
              className="resize-none"
            />
          );
        }

        return (
          <Input
            {...field}
            value={field.value as string}
            type="text"
            placeholder={`Enter ${startCase(name)}`}
          />
        );
      }}
    />
  );

  const renderAnswerOptions = () => {
    if (
      questionType !== "single_choice" &&
      questionType !== "multiple_choice"
    ) {
      return null;
    }

    return (
      <div className="space-y-4">
        <Label>Answer Options</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2">
            <Controller
              name={`questionAnswers.${index}.optionText`}
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter answer option" />
              )}
            />
            <Controller
              name={`questionAnswers.${index}.isStudentAnswer`}
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Button type="button" onClick={() => remove(index)}>
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() =>
            append({
              optionText: "",
              position: fields.length,
              isStudentAnswer: false,
              questionId: id,
            })
          }
        >
          Add Option
        </Button>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Question Item</h2>
        {isEditing ? (
          <div>
            <Button type="submit" disabled={!isDirty} className="mr-2">
              Save
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        )}
      </div>
      <div className="space-y-4">
        {(
          [
            "questionType",
            "questionBody",
            "state",
            "solutionExplanation",
          ] as const
        ).map((field) => (
          <div key={field} className="flex flex-col gap-y-1">
            <Label htmlFor={field}>{startCase(field)}</Label>
            {renderField(field)}
          </div>
        ))}
        {isEditing && renderAnswerOptions()}
      </div>
    </form>
  );
};
