import { useFormContext } from "react-hook-form";

import { Icon } from "~/components/Icon";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { SELECT_OPTION_VARIANTS } from "~/modules/Courses/Lesson/constants";

import type { QuizForm } from "~/modules/Courses/Lesson/types";

type MultiSelectProps = {
  answer: string | null;
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
  const { register, setValue, getValues } = useFormContext<QuizForm>();

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
        "border-primary-200 flex items-center space-x-3 rounded-lg border px-4 py-3 *:cursor-pointer",
        { "cursor-not-allowed": isFieldDisabled },
        classes,
      )}
    >
      <Input
        className={cn("h-4 w-4", {
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
        className="body-base flex w-full justify-between text-start font-normal text-neutral-950"
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
