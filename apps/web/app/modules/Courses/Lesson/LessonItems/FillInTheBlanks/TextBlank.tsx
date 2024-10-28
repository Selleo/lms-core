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
    studentAnswerText?: string;
  };
  handleOnBlur: (value: string, index: number) => void;
};

export const TextBlank = ({
  isQuiz,
  index,
  studentAnswer,
  handleOnBlur,
}: TextBlankProps) => {
  const isCorrectAnswer =
    studentAnswer?.isCorrect && studentAnswer.isStudentAnswer;

  const textBlankClasses = cn(
    "bg-transparent border-dashed border-b mx-1.5 w-20 border-b-black focus:ring-0 focus:outline-none",
    {
      "border-b-success-500 text-success-500":
        isQuiz && isCorrectAnswer && studentAnswer?.isStudentAnswer,
      "border-b-error-500 text-error-500":
        isQuiz && !isCorrectAnswer && studentAnswer?.isStudentAnswer,
    },
  );

  const isDisabled =
    isQuiz &&
    (!!studentAnswer?.isCorrect ||
      !!studentAnswer?.isStudentAnswer ||
      !!studentAnswer?.optionText);

  return (
    <input
      key={index}
      defaultValue={studentAnswer?.studentAnswerText}
      {...(!isDisabled && {
        onBlur: (e) => {
          const value = e.target.value;

          handleOnBlur(value, index);
        },
      })}
      type="text"
      className={textBlankClasses}
      disabled={isDisabled}
    />
  );
};
