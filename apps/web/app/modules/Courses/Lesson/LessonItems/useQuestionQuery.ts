import { useEffect, useCallback } from "react";
import { useQuestionAnswer } from "~/api/mutations/useQuestion";

type TProps = {
  lessonId: string;
  questionId: string;
  openQuestion: string;
  selectedOption: string[];
  isOpenAnswer: boolean;
};

export const useQuestionQuery = ({
  lessonId,
  questionId,
  openQuestion,
  selectedOption,
  isOpenAnswer,
}: TProps) => {
  const { mutateAsync: answerQuestion } = useQuestionAnswer();

  const sendAnswer = useCallback(async () => {
    const answer = isOpenAnswer ? openQuestion : selectedOption;
    if (
      (isOpenAnswer && openQuestion !== "") ||
      (!isOpenAnswer && selectedOption.length > 0)
    ) {
      await answerQuestion({
        lessonId,
        questionId,
        answer,
      });
    }
  }, [
    answerQuestion,
    isOpenAnswer,
    lessonId,
    openQuestion,
    questionId,
    selectedOption,
  ]);

  useEffect(() => {
    sendAnswer();
  }, [sendAnswer]);
};
