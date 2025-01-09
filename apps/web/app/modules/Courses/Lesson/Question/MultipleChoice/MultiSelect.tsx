import { useFormContext } from "react-hook-form";

import { Icon } from "~/components/Icon";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { SELECT_OPTION_VARIANTS } from "~/modules/Courses/Lesson/constants";

import type { TQuestionsForm } from "~/modules/Courses/Lesson/types";

type MultiSelectProps = {
  answer: string;
  answerId: string;
  isCorrectAnswer?: boolean | null;
  isCorrectAnswerNotSelected?: boolean | null;
  isFieldDisabled: boolean;
  isCompleted: boolean;
  isStudentAnswer: boolean;
  isWrongAnswer: boolean;
  questionId: string;
  optionFieldId?: "multiAnswerQuestions" | "photoQuestionMultipleChoice";
};

export const MultiSelect = ({
  questionId,
  isFieldDisabled,
  answerId,
  isCorrectAnswer,
  isWrongAnswer,
  isStudentAnswer,
  isCorrectAnswerNotSelected,
  isCompleted,
  answer,
  optionFieldId = "multiAnswerQuestions",
}: MultiSelectProps) => {
  const { register, setValue, getValues } = useFormContext<TQuestionsForm>();

  const getAnswerClasses = () => {
    if (isCorrectAnswer === null) return SELECT_OPTION_VARIANTS.default;

    if (isCorrectAnswerNotSelected) {
      return SELECT_OPTION_VARIANTS.correctAnswerUnselected;
    }

    if (isCorrectAnswer) {
      return SELECT_OPTION_VARIANTS.correctAnswerSelected;
    }

    if (isWrongAnswer) {
      return SELECT_OPTION_VARIANTS.incorrectAnswerSelected;
    }

    return SELECT_OPTION_VARIANTS.default;
  };

  const classes = getAnswerClasses();

  const isInputToggleHidden =
    isCompleted &&
    isStudentAnswer &&
    (isCorrectAnswerNotSelected || isWrongAnswer || isCorrectAnswer);

  return (
    <label
      htmlFor={answerId}
      className={cn(
        "flex items-center space-x-3 border *:cursor-pointer border-primary-200 rounded-lg py-3 px-4",
        { "cursor-not-allowed": isFieldDisabled },
        classes,
      )}
    >
      <Input
        className={cn("w-4 h-4", {
          "not-sr-only": !isCompleted,
          "sr-only": isInputToggleHidden,
        })}
        id={answerId}
        readOnly
        type="checkbox"
        value={answerId}
        {...register(`${optionFieldId}.${questionId}.${answerId}`)}
        onChange={(event) => {
          const clickedOption = event.target.value;
          const currentValues =
            optionFieldId === "multiAnswerQuestions"
              ? getValues().multiAnswerQuestions[questionId]
              : getValues().photoQuestionMultipleChoice[questionId];

          const updatedValues = Object.keys(currentValues).reduce<Record<string, string | null>>(
            (acc, key) => {
              if (key === clickedOption) {
                acc[key] = currentValues[key] ? null : key;
              } else {
                acc[key] = currentValues[key];
              }
              return acc;
            },
            {},
          );

          setValue(`${optionFieldId}.${questionId}`, updatedValues);
        }}
        onBlur={undefined}
      />
      <Icon
        name={
          isCorrectAnswer || isCorrectAnswerNotSelected
            ? "InputRoundedMarkerSuccess"
            : "InputRoundedMarkerError"
        }
        className={cn("!ml-0", {
          "sr-only":
            !isCompleted ||
            isCorrectAnswerNotSelected ||
            (!isCorrectAnswerNotSelected && !isStudentAnswer),
        })}
      />
      <Label
        className="body-base font-normal w-full flex justify-between text-start text-neutral-950"
        htmlFor={answerId}
        onClick={(e) => e.stopPropagation()}
      >
        <span>{answer}</span>
        <span className={classes}>
          {isStudentAnswer && isCompleted && "(Your answer)"}
          {isCorrectAnswerNotSelected && "(Missing answer)"}
        </span>
      </Label>
    </label>
  );
};
