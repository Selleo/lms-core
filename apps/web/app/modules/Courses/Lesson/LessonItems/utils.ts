import type { UseFormGetValues } from "react-hook-form";
import type { TQuestionsForm } from "../types";

type TProps = {
  getValues: UseFormGetValues<TQuestionsForm>;
  isSingleQuestion: boolean;
  questionId: string;
};

export const getQuestionDefaultValue = ({
  getValues,
  isSingleQuestion,
  questionId,
}: TProps): string[] => {
  const defaultValues = getValues(
    `${isSingleQuestion ? "singleAnswerQuestions" : "multiAnswerQuestions"}.${questionId}`
  );

  return Object.values(defaultValues || {}).filter(Boolean) as string[];
};
