import { useEffect } from "react";
import { useIsMount } from "~/hooks/useIsMount";
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
  const isMount = useIsMount();

  const { mutateAsync: answerQuestion } = useQuestionAnswer();

  useEffect(() => {
    const sendOpenAnswer = async () => {
      await answerQuestion({
        lessonId,
        questionId,
        answer: openQuestion,
      });
    };

    const sendAnswer = async () => {
      await answerQuestion({
        lessonId,
        questionId,
        answer: selectedOption,
      });
    };

    if (isMount) {
      if (isOpenAnswer) {
        sendOpenAnswer();
      } else {
        sendAnswer();
      }
    }
  }, [
    answerQuestion,
    isMount,
    isOpenAnswer,
    lessonId,
    openQuestion,
    questionId,
    selectedOption,
  ]);
};
