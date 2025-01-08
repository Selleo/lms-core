import { useUserRole } from "~/hooks/useUserRole";
import { MultipleChoiceOptionList } from "~/modules/Courses/Lesson/Question/MultipleChoice/MultipleChoiceOptionList";

import { QuestionCard } from "../QuestionCard";

import type { QuizQuestion } from "../types";

type PhotoQuestionMultipleChoiceProps = {
  question: QuizQuestion;
  isQuizCompleted?: boolean;
};

export const PhotoQuestionMultipleChoice = ({
  question,
  isQuizCompleted = false,
}: PhotoQuestionMultipleChoiceProps) => {
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
      <MultipleChoiceOptionList
        options={question.options ?? []}
        questionId={question.id}
        isQuizCompleted={isQuizCompleted}
        isAdmin={isAdmin}
        withPicture
      />
    </QuestionCard>
  );
};
