import { isEqual, startCase } from "lodash-es";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import type { UpdateQuestionItemBody } from "~/api/generated-api";
import { useUpdateQuestionItem } from "~/api/mutations/admin/useUpdateQuestionItem";
import { useUpdateQuestionOptions } from "~/api/mutations/admin/useUpdateQuestionOptions";
import {
  questionOptions as questionQueryOptions,
  useQuestionOptions,
} from "~/api/queries/admin/useQuestionOptions";
import { queryClient } from "~/api/queryClient";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

import { AnswerOptions } from "./question/AnswerOptions";
import { QuestionField } from "./question/QuestionField";

import type { QuestionItemProps } from "./question/types";

export const QuestionItem = ({ id, initialData, onUpdate }: QuestionItemProps) => {
  const { mutateAsync: updateQuestionItem } = useUpdateQuestionItem();
  const { mutateAsync: updateAnswerOptions } = useUpdateQuestionOptions();
  const { data: questionOptions } = useQuestionOptions(id);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm<UpdateQuestionItemBody>({
    defaultValues: {
      ...initialData,
      questionAnswers: [],
    },
  });

  const fieldArray = useFieldArray({
    control,
    name: "questionAnswers",
  });

  const questionType = watch("questionType");

  useEffect(() => {
    if (questionOptions) {
      const sortedOptions = questionOptions
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        .map((option) => ({
          id: option.id,
          optionText: option.optionText,
          isCorrect: option.isCorrect,
          position: option.position,
          questionId: id,
        }));

      if (!isEqual(sortedOptions, fieldArray.fields)) {
        fieldArray.replace(sortedOptions);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionOptions, id, fieldArray.replace]);

  useEffect(() => {
    if (questionType === "open_answer") {
      fieldArray.replace([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionType, fieldArray.replace]);

  const onSubmit = async (data: UpdateQuestionItemBody) => {
    try {
      await updateQuestionItem({ data, questionId: id });

      if (data.questionAnswers && questionType !== "open_answer") {
        const options = data.questionAnswers.map((option, index) => ({
          ...(option.id && { id: option.id }),
          questionId: id,
          optionText: option.optionText,
          isCorrect: option.isCorrect,
          position: index,
        }));

        await updateAnswerOptions({
          data: options,
          questionId: id,
        });
      }

      onUpdate();
      queryClient.invalidateQueries(questionQueryOptions(id));
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Question Item</h2>
        <Button type="submit" disabled={!isDirty} className="mr-2">
          Save
        </Button>
      </div>
      <div className="space-y-4">
        {(
          ["questionType", "questionBody", "state", "solutionExplanation", "archived"] as const
        ).map((field) => (
          <div key={field} className="flex flex-col gap-y-1">
            <Label htmlFor={field}>{field === "archived" ? "Status" : startCase(field)}</Label>
            <QuestionField name={field} control={control} />
          </div>
        ))}
        <AnswerOptions
          questionType={questionType}
          isEditing
          control={control}
          fieldArray={fieldArray}
          id={id}
        />
      </div>
    </form>
  );
};
