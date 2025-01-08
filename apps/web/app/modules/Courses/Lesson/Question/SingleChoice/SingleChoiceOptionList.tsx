import { SingleSelect } from "./SingleSelect";
import { getOptionConfig } from "./utils";

import type { QuizQuestionOption } from "../types";

type SingleChoiceOptionListProps = {
  options: QuizQuestionOption[];
  questionId: string;
  isAdmin: boolean;
  isQuizCompleted: boolean;
  withPicture?: boolean;
};

export const SingleChoiceOptionList = ({
  options,
  questionId,
  isAdmin,
  isQuizCompleted,
  withPicture = false,
}: SingleChoiceOptionListProps) => (
  <>
    {options.map((option) => (
      <SingleSelect
        key={option.id}
        answer={option.optionText}
        answerId={option.id}
        questionId={questionId}
        isQuizSubmitted={isQuizCompleted}
        optionFieldId={withPicture ? "photoQuestionSingleChoice" : "singleAnswerQuestions"}
        {...getOptionConfig(option, isAdmin)}
      />
    ))}
  </>
);
