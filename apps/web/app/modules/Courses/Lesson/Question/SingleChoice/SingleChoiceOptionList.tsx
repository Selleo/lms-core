import { SingleSelect } from "./SingleSelect";
import { getOptionConfig } from "./utils";

import type { QuizQuestionOption } from "../types";

type SingleChoiceOptionListProps = {
  options: QuizQuestionOption[];
  questionId: string;
  isAdmin: boolean;
  isCompleted: boolean;
  withPicture?: boolean;
};

export const SingleChoiceOptionList = ({
  options,
  questionId,
  isAdmin,
  isCompleted,
  withPicture = false,
}: SingleChoiceOptionListProps) => (
  <>
    {options.map((option) => (
      <SingleSelect
        key={option.id}
        answer={option.optionText}
        answerId={option.id}
        questionId={questionId}
        isCompleted={isCompleted}
        optionFieldId={withPicture ? "photoQuestionSingleChoice" : "singleAnswerQuestions"}
        {...getOptionConfig(option, isAdmin)}
      />
    ))}
  </>
);
