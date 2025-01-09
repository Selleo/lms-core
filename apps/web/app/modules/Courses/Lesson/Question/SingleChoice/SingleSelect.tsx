import { useFormContext } from "react-hook-form";

import { Icon } from "~/components/Icon";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { SELECT_OPTION_VARIANTS } from "~/modules/Courses/Lesson/constants";

import type { TQuestionsForm } from "~/modules/Courses/Lesson/types";

type SelectAnswerOptionQuizProps = {
  answer: string;
  answerId: string;
  isCorrectAnswer?: boolean | null;
  isCorrectAnswerNotSelected?: boolean | null;
  isFieldDisabled: boolean;
  isCompleted: boolean;
  isStudentAnswer: boolean;
  isWrongAnswer: boolean;
  questionId: string;
  optionFieldId?: "singleAnswerQuestions" | "photoQuestionSingleChoice";
};

export const SingleSelect = ({
  answer,
  answerId,
  isCorrectAnswer,
  isCorrectAnswerNotSelected,
  isFieldDisabled,
  isCompleted,
  isStudentAnswer,
  isWrongAnswer,
  questionId,
  optionFieldId = "singleAnswerQuestions",
}: SelectAnswerOptionQuizProps) => {
  const { register, setValue, getValues } = useFormContext<TQuestionsForm>();

  const getAnswerClasses = () => {
    if (isCorrectAnswer === null) return SELECT_OPTION_VARIANTS.default;

    if (isCorrectAnswer || isCorrectAnswerNotSelected) {
      return SELECT_OPTION_VARIANTS.correctAnswerSelected;
    }

    if (isWrongAnswer) {
      return SELECT_OPTION_VARIANTS.incorrectAnswerSelected;
    }

    return SELECT_OPTION_VARIANTS.default;
  };

  const classes = getAnswerClasses();

  const isInputToggleHidden =
    (isCompleted && !isStudentAnswer && isCorrectAnswerNotSelected) ||
    (isCompleted &&
      isStudentAnswer &&
      (isCorrectAnswerNotSelected || isWrongAnswer || isCorrectAnswer));

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
        type="radio"
        value={answerId}
        {...register(`${optionFieldId}.${questionId}.${answerId}`)}
        onChange={(event) => {
          const { singleAnswerQuestions, photoQuestionSingleChoice } = getValues();

          const answersByFieldId =
            optionFieldId === "singleAnswerQuestions"
              ? singleAnswerQuestions
              : photoQuestionSingleChoice;

          const updatedAnswers = Object.keys(answersByFieldId[questionId]).reduce<
            Record<string, string | null>
          >((acc, key) => {
            if (key === answerId) {
              acc[key] = event.target.value;

              return acc;
            }

            acc[key] = null;

            return acc;
          }, {});

          setValue(`${optionFieldId}.${questionId}`, updatedAnswers);
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
          "sr-only": !isCompleted || (!isCorrectAnswerNotSelected && !isStudentAnswer),
        })}
      />
      <Label
        className="body-base font-normal w-full flex justify-between text-start text-neutral-950"
        htmlFor={answerId}
        onClick={(e) => e.stopPropagation()}
      >
        <span>{answer}</span>
        <span className={classes}>{isStudentAnswer && isCompleted && "(Your answer)"}</span>
      </Label>
    </label>
  );
};
