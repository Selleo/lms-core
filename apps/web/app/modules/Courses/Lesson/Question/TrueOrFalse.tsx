import { useFormContext } from "react-hook-form";

import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

import { QuestionCard } from "./QuestionCard";

import type { QuizQuestion } from "./types";
import type { QuizForm } from "~/modules/Courses/Lesson/types";

type TrueOrFalseProps = {
  question: QuizQuestion;
  isCompleted?: boolean;
};

export const TrueOrFalse = ({ question, isCompleted }: TrueOrFalseProps) => {
  const { register } = useFormContext<QuizForm>();

  return (
    <QuestionCard
      title={question.title ?? ""}
      questionType="True or false question."
      questionNumber={question.displayOrder ?? 0}
    >
      {question.options?.map(
        ({ optionText, id, isCorrect, studentAnswer = false, isStudentAnswer }, index) => (
          <div
            key={index}
            className={cn(
              "body-base text-neutral-950 w-full gap-x-4 py-3 px-4 border border-neutral-200 rounded-lg flex",
              {
                "border-success-700 bg-success-50": isCorrect && isStudentAnswer,
                "border-error-700 bg-error-50":
                  (!isCorrect && isStudentAnswer && isCompleted) ||
                  (!isCorrect && !isStudentAnswer && isCompleted) ||
                  (isCorrect && !isStudentAnswer && isCompleted),
                "has-[input:checked]:bg-primary-50 [&]:has-[input:checked]:border-primary-500":
                  !isCompleted,
              },
            )}
          >
            <div className="w-full">{optionText}</div>
            <div className="flex gap-x-4">
              <label className="flex items-center gap-x-1">
                <Input
                  className="size-4"
                  {...(studentAnswer === "true" && { checked: true })}
                  type="radio"
                  value="true"
                  {...register(`trueOrFalseQuestions.${question.id}.${id}`)}
                  name={`trueOrFalseQuestions.${question.id}.${id}`}
                />{" "}
                True
              </label>
              <label className="flex items-center gap-x-1">
                <Input
                  className="size-4"
                  {...(studentAnswer === "false" && { checked: true })}
                  {...register(`trueOrFalseQuestions.${question.id}.${id}`)}
                  name={`trueOrFalseQuestions.${question.id}.${id}`}
                  type="radio"
                  value="false"
                />{" "}
                False
              </label>
            </div>
          </div>
        ),
      )}
    </QuestionCard>
  );
};
