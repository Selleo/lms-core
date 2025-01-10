import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

import { cn } from "~/lib/utils";

import type { QuizQuestionOption } from "../types";
import type { TQuestionsForm } from "~/modules/Courses/Lesson/types";

type TextBlankProps = {
  index: number;
  studentAnswer?: QuizQuestionOption;
  isQuizSubmitted?: boolean;
  questionId: string;
};

export const TextBlank = ({
  index,
  studentAnswer,
  isQuizSubmitted,
  questionId,
}: TextBlankProps) => {
  const { register } = useFormContext<TQuestionsForm>();
  const inputRef = useRef<HTMLInputElement>(null);
  const formFieldId = `${index + 1}`;

  useEffect(() => {
    if (!inputRef?.current) return;

    if (isQuizSubmitted) {
      inputRef.current.value = studentAnswer?.studentAnswer ?? "";
    } else {
      inputRef.current.value = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuizSubmitted]);

  const isCorrectAnswer = studentAnswer?.isCorrect && studentAnswer.isStudentAnswer;

  const textBlankClasses = cn(
    "bg-transparent border-dashed border-b mx-1.5 w-20 focus:ring-0 focus:outline-none text-primary-700 border-b-primary-700",
    {
      "border-b-success-500 text-success-500": isCorrectAnswer && studentAnswer?.isStudentAnswer,
      "border-b-error-500 text-error-500":
        typeof studentAnswer?.isStudentAnswer === "boolean" && !studentAnswer?.isStudentAnswer,
    },
  );

  const isDisabled =
    studentAnswer?.isCorrect && (!!studentAnswer?.isStudentAnswer || !!studentAnswer?.optionText);

  return (
    <input
      key={index}
      type="text"
      className={textBlankClasses}
      {...(studentAnswer?.studentAnswer && { defaultValue: studentAnswer.studentAnswer })}
      disabled={!!isDisabled}
      {...register(`fillInTheBlanksText.${questionId}.${formFieldId}`)}
    />
  );
};
