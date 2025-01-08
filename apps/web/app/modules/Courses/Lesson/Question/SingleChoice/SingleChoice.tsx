import { useUserRole } from "~/hooks/useUserRole";
import { QuestionCard } from "~/modules/Courses/Lesson/Question/QuestionCard";

import { SingleChoiceOptionList } from "./SingleChoiceOptionList";

import type { QuizQuestion } from "../types";

type SingleChoiceProps = {
  question: QuizQuestion;
  isQuizCompleted?: boolean;
};

export const SingleChoice = ({ question, isQuizCompleted = false }: SingleChoiceProps) => {
  const { isAdmin } = useUserRole();

  return (
    <QuestionCard
      title={question.title || ""}
      questionType="Single Choice question"
      questionNumber={question.displayOrder || 0}
    >
      <SingleChoiceOptionList
        options={question.options || []}
        questionId={question.id}
        isAdmin={isAdmin}
        isQuizCompleted={isQuizCompleted}
      />
    </QuestionCard>
  );
};
