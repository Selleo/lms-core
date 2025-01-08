import { useUserRole } from "~/hooks/useUserRole";

import { QuestionCard } from "../QuestionCard";
import { SingleChoiceOptionList } from "../SingleChoice/SingleChoiceOptionList";

import type { QuizQuestion } from "../types";

type PhotoQuestionSingleChoiceProps = {
  question: QuizQuestion;
  isQuizCompleted?: boolean;
};

export const PhotoQuestionSingleChoice = ({
  question,
  isQuizCompleted = false,
}: PhotoQuestionSingleChoiceProps) => {
  const { isAdmin } = useUserRole();

  return (
    <QuestionCard
      title={question.title}
      questionType="Single select question."
      questionNumber={question.displayOrder}
    >
      <img
        src={question.photoS3Key || "https://placehold.co/960x620/png"}
        alt=""
        className="w-full h-auto max-w-[960px] rounded-lg"
      />
      <SingleChoiceOptionList
        options={question.options || []}
        questionId={question.id}
        isAdmin={isAdmin}
        isQuizCompleted={isQuizCompleted}
        withPicture
      />
    </QuestionCard>
  );
};
