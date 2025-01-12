import { useTranslation } from "react-i18next";

type QuestionCorrectAnswersProps = {
  canRenderAnswers: boolean;
  questionAnswers?: {
    id: string;
    optionText: string;
    displayOrder: number | null;
    isStudentAnswer?: boolean | null | undefined;
    isCorrect?: boolean | null | undefined;
  }[];
};

export const QuestionCorrectAnswers = ({
  canRenderAnswers,
  questionAnswers,
}: QuestionCorrectAnswersProps) => {
  const { t } = useTranslation();
  if (!canRenderAnswers || !questionAnswers) return null;

  const answersString = questionAnswers
    .filter((answer) => answer.isCorrect)
    .map((answer) => answer.optionText)
    .join(", ");

  return (
    <div>
      <span className="body-base-md text-error-700">
        {t("studentLessonView.other.correctAnswers")}
      </span>{" "}
      {answersString}
    </div>
  );
};
