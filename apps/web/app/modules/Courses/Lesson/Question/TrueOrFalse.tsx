import { useFormContext } from "react-hook-form";

import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

import { QuestionCard } from "./QuestionCard";

import type { GetLessonByIdResponse } from "~/api/generated-api";
import type { TQuestionsForm } from "~/modules/Courses/Lesson/types";

type Question = NonNullable<GetLessonByIdResponse["data"]["quizDetails"]>["questions"][number];

type TrueOrFalseProps = {
  question: Question;
};

export const TrueOrFalse = ({ question }: TrueOrFalseProps) => {
  const { register } = useFormContext<TQuestionsForm>();

  return (
    <QuestionCard
      title={question.title ?? ""}
      questionType="True or false question."
      questionNumber={question.displayOrder ?? 0}
    >
      {question.options?.map(({ optionText, id, isCorrect, studentAnswer = false }, index) => (
        <div
          key={index}
          className={cn(
            "body-base text-neutral-950 w-full gap-x-4 py-3 px-4 border border-neutral-200 rounded-lg flex",
            {
              "border-success-700 bg-success-50 text-success-700":
                isCorrect === studentAnswer && question?.passQuestion !== null,
              "border-error-700 bg-error-50 text-error-700":
                isCorrect !== studentAnswer && question?.passQuestion !== null,
            },
          )}
        >
          <div className="w-full">{optionText}</div>
          <div className="flex gap-x-4">
            <label className="flex items-center gap-x-1">
              <Input
                className="size-4"
                {...(Boolean(studentAnswer) &&
                  question?.passQuestion !== null && { checked: true })}
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
                {...(!studentAnswer && question?.passQuestion !== null && { checked: true })}
                {...register(`trueOrFalseQuestions.${question.id}.${id}`)}
                name={`trueOrFalseQuestions.${question.id}.${id}`}
                type="radio"
                value="false"
              />{" "}
              False
            </label>
          </div>
        </div>
      ))}
    </QuestionCard>
  );
};
