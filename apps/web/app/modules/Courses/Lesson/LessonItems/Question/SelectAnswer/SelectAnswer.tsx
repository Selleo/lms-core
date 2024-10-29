import type { GetLessonResponse } from "~/api/generated-api";
import { SelectAnswerOption } from "./SelectAnswerOption";
import { SelectAnswerOptionQuiz } from "./SelectAnswerOptionQuiz";

type SingleSelectQuestionProps = {
  questionId: string;
  content: GetLessonResponse["data"]["lessonItems"][number]["content"];
  isAdmin: boolean;
  isSubmitted?: boolean;
  selectedOption: string[];
  handleClick: (value: string) => void;
  isQuiz: boolean;
  isMultiAnswer: boolean;
};

export const SelectAnswer = ({
  questionId,
  content,
  isAdmin,
  isSubmitted,
  selectedOption,
  handleClick,
  isQuiz = false,
  isMultiAnswer = false,
}: SingleSelectQuestionProps) => {
  if (!("questionAnswers" in content)) return null;

  return content.questionAnswers
    .sort((a, b) => {
      if (a.position !== null && b.position !== null) {
        return a.position - b.position;
      }

      return 0;
    })
    .map(({ isCorrect, isStudentAnswer, optionText, id }) => {
      const isFieldDisabled = isAdmin || typeof isCorrect === "boolean";

      const isCorrectAnswer = Boolean(isCorrect && isStudentAnswer);

      const isWrongAnswer = Boolean(!isCorrect && isStudentAnswer);

      const isCorrectAnswerNotSelected = isCorrect && !isStudentAnswer;

      const isAnswerChecked = selectedOption.includes(id) && isCorrect === null;

      const config = {
        isFieldDisabled,
        isWrongAnswer,
        isCorrectAnswerNotSelected,
        isAnswerChecked,
        isCorrectAnswer: isCorrect,
        isCorrectAnswerSelected: isCorrectAnswer,
        isChecked: isAnswerChecked,
        isStudentAnswer: !!isStudentAnswer,
        isMultiAnswer,
      };

      if (isQuiz) {
        return (
          <SelectAnswerOptionQuiz
            key={id}
            answer={optionText}
            answerId={id}
            handleOnClick={handleClick}
            isQuizSubmitted={!!isSubmitted}
            questionId={questionId}
            {...config}
          />
        );
      }
      console.log({ selectedOption });
      return (
        <SelectAnswerOption
          key={id}
          answer={optionText}
          answerId={id}
          handleOnClick={handleClick}
          questionId={questionId}
          {...config}
          isChecked={selectedOption.includes(id)}
        />
      );
    });
};
