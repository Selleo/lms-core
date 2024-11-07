import { useQuestionAnswer } from "~/api/mutations/useQuestion";

import type { AnswerQuestionBody } from "~/api/generated-api";

type TProps = {
  lessonId: string;
  questionId: string;
  courseId: string;
};

export const useQuestionQuery = ({ lessonId, questionId, courseId }: TProps) => {
  const { mutateAsync: answerQuestion } = useQuestionAnswer();

  const sendOpenAnswer = async (openQuestion: string) => {
    await answerQuestion({
      lessonId,
      questionId,
      courseId,
      answer: openQuestion,
    });
  };

  const sendAnswer = async (selectedOption: AnswerQuestionBody["answer"]) => {
    await answerQuestion({
      lessonId,
      questionId,
      courseId,
      answer: selectedOption,
    });
  };

  return {
    sendOpenAnswer,
    sendAnswer,
  };
};
