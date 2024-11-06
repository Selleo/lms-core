import { useEffect, useRef } from "react";

import { cn } from "~/lib/utils";

type TextBlankProps = {
  isQuiz: boolean;
  index: number;
  studentAnswer?: {
    id: string;
    optionText: string;
    position: number | null;
    isStudentAnswer?: boolean | null;
    isCorrect?: boolean | null;
    studentAnswerText?: string | null;
  };
  handleOnBlur: (value: string, index: number) => void;
  isQuizSubmitted?: boolean;
};

export const TextBlank = ({
  isQuiz,
  index,
  studentAnswer,
  handleOnBlur,
  isQuizSubmitted,
}: TextBlankProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef?.current) return;

    if (isQuiz) {
      if (isQuizSubmitted) {
        inputRef.current.value = studentAnswer?.studentAnswerText ?? "";
      } else {
        inputRef.current.value = "";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuiz, isQuizSubmitted]);

  const isCorrectAnswer = studentAnswer?.isCorrect && studentAnswer.isStudentAnswer;

  const textBlankClasses = cn(
    "bg-transparent border-dashed border-b mx-1.5 w-20 focus:ring-0 focus:outline-none text-primary-700 border-b-primary-700",
    {
      "border-b-success-500 text-success-500":
        isQuiz && isCorrectAnswer && studentAnswer?.isStudentAnswer,
      "border-b-error-500 text-error-500":
        isQuiz && studentAnswer?.isCorrect && !studentAnswer?.isStudentAnswer,
    },
  );

  const isDisabled =
    isQuiz &&
    studentAnswer?.isCorrect &&
    (!!studentAnswer?.isStudentAnswer || !!studentAnswer?.optionText);

  return (
    <input
      ref={inputRef}
      key={index}
      type="text"
      className={textBlankClasses}
      disabled={!!isDisabled}
      {...(!isQuiz && { defaultValue: studentAnswer?.studentAnswerText ?? "" })}
      {...(!isDisabled && {
        onBlur: (e) => {
          const value = e.target.value;

          handleOnBlur(value, index);
        },
      })}
    />
  );
};
