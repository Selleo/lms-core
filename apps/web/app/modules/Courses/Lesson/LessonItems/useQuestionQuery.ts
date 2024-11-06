import { type AnswerQuestionBody } from "~/api/generated-api";
import { useQuestionAnswer } from "~/api/mutations/useQuestion";

type TProps = {
  lessonId: string;
  questionId: string;
};

export const useQuestionQuery = ({ lessonId, questionId }: TProps) => {
  const { mutateAsync: answerQuestion } = useQuestionAnswer();

  const sendOpenAnswer = async (openQuestion: string) => {
    await answerQuestion({
      lessonId,
      questionId,
      answer: openQuestion,
    });
  };

  const sendAnswer = async (selectedOption: AnswerQuestionBody["answer"]) => {
    await answerQuestion({
      lessonId,
      questionId,
      answer: selectedOption,
    });
  };

  return {
    sendOpenAnswer,
    sendAnswer,
  };
};
