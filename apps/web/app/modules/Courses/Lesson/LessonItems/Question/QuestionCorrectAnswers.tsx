type QuestionCorrectAnswersProps = {
  canRenderAnswers: boolean;
  questionAnswers?: {
    id: string;
    optionText: string;
    position: number | null;
    isStudentAnswer?: boolean | null | undefined;
    isCorrect?: boolean | null | undefined;
  }[];
};

export const QuestionCorrectAnswers = ({
  canRenderAnswers,
  questionAnswers,
}: QuestionCorrectAnswersProps) => {
  if (!canRenderAnswers || !questionAnswers) return null;

  const answersString = questionAnswers
    .filter((answer) => answer.isCorrect)
    .map((answer) => answer.optionText)
    .join(", ");

  return (
    <div>
      <span className="body-base-md text-error-700">Correct answers:</span> {answersString}
    </div>
  );
};
