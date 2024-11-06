import { useFormContext } from "react-hook-form";

import { Icon } from "~/components/Icon";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { SELECT_OPTION_VARIANTS } from "~/modules/Courses/Lesson/LessonItems/constants";
import type { TQuestionsForm } from "~/modules/Courses/Lesson/types";

type SelectAnswerOptionQuizProps = {
  isFieldDisabled: boolean;
  answerId: string;
  answer: string;
  isCorrectAnswer?: boolean | null;
  isWrongAnswer: boolean;
  isChecked: boolean;
  isStudentAnswer: boolean;
  isQuizSubmitted: boolean;
  questionId: string;
  handleOnClick: (value: string) => void;
  isCorrectAnswerNotSelected?: boolean | null;
  isMultiAnswer: boolean;
};

export const SelectAnswerOptionQuiz = ({
  questionId,
  isFieldDisabled,
  answerId,
  isCorrectAnswer,
  isWrongAnswer,
  isChecked,
  isStudentAnswer,
  isCorrectAnswerNotSelected,
  isQuizSubmitted,
  answer,
  isMultiAnswer,
  handleOnClick,
}: SelectAnswerOptionQuizProps) => {
  const { register } = useFormContext<TQuestionsForm>();

  const getAnswerClasses = () => {
    if (isChecked) return SELECT_OPTION_VARIANTS.checked;

    if (isCorrectAnswer === null) return SELECT_OPTION_VARIANTS.default;

    if (isMultiAnswer) {
      if (isCorrectAnswerNotSelected) {
        return SELECT_OPTION_VARIANTS.correctAnswerUnselected;
      }

      if (isCorrectAnswer) {
        return SELECT_OPTION_VARIANTS.correctAnswerSelected;
      }
    }

    if (!isMultiAnswer) {
      if (isCorrectAnswer || isCorrectAnswerNotSelected) {
        return SELECT_OPTION_VARIANTS.correctAnswerSelected;
      }
    }

    if (isWrongAnswer) {
      return SELECT_OPTION_VARIANTS.incorrectAnswerSelected;
    }

    return SELECT_OPTION_VARIANTS.default;
  };

  const classes = getAnswerClasses();

  const isInputToggleHidden =
    (isQuizSubmitted && !isStudentAnswer && isCorrectAnswerNotSelected && !isMultiAnswer) ||
    (isQuizSubmitted &&
      isStudentAnswer &&
      (isCorrectAnswerNotSelected || isWrongAnswer || isCorrectAnswer));

  return (
    <button
      type="button"
      {...(!isFieldDisabled && {
        onClick: () => handleOnClick(answerId),
      })}
      className={cn(
        "flex items-center space-x-3 border border-primary-200 rounded-lg py-3 px-4",
        { "cursor-not-allowed": isFieldDisabled },
        classes,
      )}
    >
      <label htmlFor={answerId}>
        <Input
          className={cn("w-4 h-4", {
            "not-sr-only": !isQuizSubmitted,
            "sr-only": isInputToggleHidden,
          })}
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
        <Icon
          name={
            isCorrectAnswer || isCorrectAnswerNotSelected
              ? "InputRoundedMarkerSuccess"
              : "InputRoundedMarkerError"
          }
          className={cn({
            "sr-only":
              !isQuizSubmitted ||
              (isCorrectAnswerNotSelected && isMultiAnswer) ||
              (!isCorrectAnswerNotSelected && !isChecked && !isStudentAnswer),
          })}
        />
      </label>
      <Label
        className="body-base font-normal w-full flex justify-between text-start text-neutral-950"
        htmlFor={answerId}
        onClick={(e) => e.stopPropagation()}
      >
        <span>{answer}</span>
        <span className={classes}>{isStudentAnswer && isQuizSubmitted && "(Your answer)"}</span>
      </Label>
    </button>
  );
};
