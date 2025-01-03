import { SelectAnswerOption } from "./SelectAnswerOption";
import { SelectAnswerOptionQuiz } from "./SelectAnswerOptionQuiz";

import type { GetLessonByIdResponse } from "~/api/generated-api";

type SingleSelectQuestionProps = {
  questionId: string;
  content: GetLessonByIdResponse["data"]["quizDetails"]["questions"][number];
  isAdmin: boolean;
  isSubmitted?: boolean;
  selectedOption: string[];
  handleClick: (value: string) => void;
  isQuiz: boolean;
  isMultiAnswer: boolean;
  isImageSelect?: boolean;
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
  return content.map(({ isCorrect, optionText, id }) => {
    const isFieldDisabled = isAdmin || typeof isCorrect === "boolean";

    const isCorrectAnswer = Boolean(isCorrect && selectedOption.includes(id));
    const isWrongAnswer = Boolean(!isCorrect && selectedOption.includes(id));
    const isCorrectAnswerNotSelected = isCorrect && !selectedOption.includes(id);
    const isAnswerChecked = selectedOption.includes(id) && isCorrect === null;

    const config = {
      isFieldDisabled,
      isWrongAnswer,
      isCorrectAnswerNotSelected,
      isAnswerChecked,
      isCorrectAnswer: isCorrect,
      isCorrectAnswerSelected: isCorrectAnswer,
      isChecked: isAnswerChecked,
      isStudentAnswer: selectedOption.includes(id),
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
