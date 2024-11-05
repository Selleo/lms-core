import { useFormContext } from "react-hook-form";
import { cn } from "~/lib/utils";
import { Input } from "~/components/ui/input";
import type { TQuestionsForm } from "~/modules/Courses/Lesson/types";
import { Label } from "~/components/ui/label";

type SelectAnswerOption = {
  isFieldDisabled: boolean;
  answerId: string;
  answer: string;
  isChecked: boolean;
  questionId: string;
  handleOnClick: (value: string) => void;
  isMultiAnswer: boolean;
};

export const SelectAnswerOption = ({
  questionId,
  isFieldDisabled,
  answerId,
  answer,
  isChecked,
  handleOnClick,
  isMultiAnswer,
}: SelectAnswerOption) => {
  const { register } = useFormContext<TQuestionsForm>();

  return (
    <button
      type="button"
      onClick={() => handleOnClick(answerId)}
      className={cn(
        "flex items-center space-x-3 border border-primary-200 rounded-lg py-3 px-4",
        { "cursor-not-allowed": isFieldDisabled },
        {
          "bg-primary-50 border-primary-500 text-primary-500": isChecked,
        },
      )}
    >
      <Input
        className="w-4 h-4"
        checked={isChecked}
        id={answerId}
        readOnly
        type={isMultiAnswer ? "checkbox" : "radio"}
        value={answerId}
        {...register(
          isMultiAnswer
            ? `multiAnswerQuestions.${questionId}.${answerId}`
            : `singleAnswerQuestions.${questionId}.${answerId}`,
        )}
      />
      <Label
        className="body-base font-normal w-full h-full flex justify-between text-start text-neutral-950"
        htmlFor={answerId}
        onClick={(e) => e.stopPropagation()}
      >
        <span>{answer}</span>
      </Label>
    </button>
  );
};
