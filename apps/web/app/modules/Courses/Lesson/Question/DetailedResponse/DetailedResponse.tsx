import { useFormContext } from "react-hook-form";

import { Textarea } from "~/components/ui/textarea";
import { useUserRole } from "~/hooks/useUserRole";
import { cn } from "~/lib/utils";
import { QuestionCard } from "~/modules/Courses/Lesson/Question/QuestionCard";

import type { QuizQuestion } from "~/modules/Courses/Lesson/Question/types";
import type { TQuestionsForm } from "~/modules/Courses/Lesson/types";

export type DetailedResponseProps = {
  question: QuizQuestion;
};
export const DetailedResponse = ({ question }: DetailedResponseProps) => {
  const { isAdmin } = useUserRole();
  const { register } = useFormContext<TQuestionsForm>();

  return (
    <QuestionCard
      title={question.title}
      questionType="Instruction: Write a detailed response (3-5 sentences)."
      questionNumber={question.displayOrder}
    >
      <Textarea
        {...register(`detailedResponses.${question.id}`)}
        placeholder="Type your answer here"
        rows={5}
        className={cn({
          "cursor-not-allowed": isAdmin,
        })}
      />
    </QuestionCard>
  );
};
