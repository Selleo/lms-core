import { useUserRole } from "~/hooks/useUserRole";
import { QuestionCard } from "~/modules/Courses/Lesson/Question/QuestionCard";

import { MultipleChoiceOptionList } from "./MultipleChoiceOptionList";

import type { QuizQuestion } from "../types";

type MultipleChoiceProps = {
  question: QuizQuestion;
  isQuizCompleted?: boolean;
};

export const MultipleChoice = ({ question, isQuizCompleted = false }: MultipleChoiceProps) => {
  const { isAdmin } = useUserRole();

  return (
    <QuestionCard
      title={question.title || ""}
      questionType="Multiple Choice question"
      questionNumber={question.displayOrder || 0}
    >
      <MultipleChoiceOptionList
        options={question.options ?? []}
        questionId={question.id}
        isQuizCompleted={isQuizCompleted}
        isAdmin={isAdmin}
      />
    </QuestionCard>
  );
};
