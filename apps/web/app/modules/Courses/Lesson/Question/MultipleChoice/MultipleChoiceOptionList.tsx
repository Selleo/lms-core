import { MultiSelect } from "~/modules/Courses/Lesson/Question/MultipleChoice/MultiSelect";

import { getOptionConfig } from "./utils";

import type { QuizQuestionOption } from "../types";

type MultipleChoiceQuestionListProps = {
  options: QuizQuestionOption[];
  questionId: string;
  isAdmin: boolean;
  isQuizCompleted: boolean;
  withPicture?: boolean;
};

export const MultipleChoiceOptionList = ({
  options,
  questionId,
  isAdmin,
  isQuizCompleted,
  withPicture = false,
}: MultipleChoiceQuestionListProps) => (
  <>
    {options.map((option) => (
      <MultiSelect
        key={option.id}
        answer={option.optionText}
        answerId={option.id}
        questionId={questionId}
        isQuizSubmitted={isQuizCompleted}
        isStudentAnswer={Boolean(option.isStudentAnswer)}
        optionFieldId={withPicture ? "photoQuestionMultipleChoice" : "multiAnswerQuestions"}
        {...getOptionConfig(option, isAdmin)}
      />
    ))}
  </>
);
