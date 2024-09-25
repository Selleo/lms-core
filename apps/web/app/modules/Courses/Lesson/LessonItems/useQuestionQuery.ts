import { useEffect, useRef } from "react";
import { useIsMount } from "~/hooks/useIsMount";
import { useQuestionAnswer } from "~/api/mutations/useQuestion";

type TProps = {
  lessonId: string;
  questionId: string;
  openQuestion: string;
  seletedOption: string[];
  isOpenAnswer: boolean;
};

export const useQuestionQuery = ({
  lessonId,
  questionId,
  openQuestion,
  seletedOption,
  isOpenAnswer,
}: TProps) => {
  const isMount = useIsMount();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const { mutateAsync: answerQuestion } = useQuestionAnswer();

  useEffect(() => {
    const sendOpenAnswer = async () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(async () => {
        await answerQuestion({
          lessonId,
          questionId,
          answer: openQuestion,
        });
      }, 1000);
    };

    const sendAnswer = async () => {
      await answerQuestion({
        lessonId,
        questionId,
        answer: seletedOption,
      });
    };

    if (isMount) {
      if (isOpenAnswer) {
        sendOpenAnswer();
      } else {
        sendAnswer();
      }
    }

    return () => {
      debounceTimeout.current && clearTimeout(debounceTimeout.current);
    };
  }, [
    answerQuestion,
    isMount,
    isOpenAnswer,
    lessonId,
    openQuestion,
    questionId,
    seletedOption,
  ]);
};
