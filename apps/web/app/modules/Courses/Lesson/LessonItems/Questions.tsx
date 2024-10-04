import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { getQuestionDefaultValue } from "./utils";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useCompletedLessonItemsStore } from "./LessonItemStore";
import { useParams } from "@remix-run/react";
import { useQuestionQuery } from "./useQuestionQuery";
import { useState } from "react";
import type { TQuestionsForm } from "../types";
import type { UseFormGetValues, UseFormRegister } from "react-hook-form";

type TProps = {
  content: {
    id: string;
    questionType: string;
    questionBody: string;
    questionAnswers: {
      id: string;
      optionText: string;
      position: number | null;
    }[];
  };
  getValues: UseFormGetValues<TQuestionsForm>;
  questionsArray: string[];
  register: UseFormRegister<TQuestionsForm>;
  isAdmin: boolean;
};

export default function Questions({
  content,
  getValues,
  questionsArray,
  register,
  isAdmin,
}: TProps) {
  const { lessonId } = useParams();

  if (!lessonId) throw new Error("Lesson ID not found");

  const { markLessonItemAsCompleted } = useCompletedLessonItemsStore();
  const questionId = content.id;
  const isSingleQuestion = content.questionType === "single_choice";
  const isOpenAnswer = content.questionType === "open_answer";

  const { sendAnswer, sendOpenAnswer } = useQuestionQuery({
    lessonId,
    questionId,
  });

  const [selectedOption, setSelectedOption] = useState<string[]>(() =>
    getQuestionDefaultValue({ getValues, questionId, isSingleQuestion }),
  );

  const handleClick = async (id: string) => {
    markLessonItemAsCompleted({ lessonItemId: questionId, lessonId });

    if (isSingleQuestion) {
      setSelectedOption([id]);
      await sendAnswer([id]);
    } else {
      let newSelectedOptions: string[];
      if (selectedOption.includes(id)) {
        newSelectedOptions = selectedOption.filter((option) => option !== id);
      } else {
        newSelectedOptions = [...selectedOption, id];
      }
      setSelectedOption(newSelectedOptions);
      await sendAnswer(newSelectedOptions);
    }
  };

  const handleOpenAnswerRequest = async (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    markLessonItemAsCompleted({
      lessonItemId: questionId,
      lessonId,
    });
    await sendOpenAnswer(e.target.value);
  };

  return (
    <Card className="flex flex-col gap-2 p-8 border-none drop-shadow-primary">
      <div className="details text-primary-700 uppercase">{`question ${questionsArray.indexOf(questionId) + 1}`}</div>
      <div
        className="h6 text-neutral-950"
        dangerouslySetInnerHTML={{ __html: content.questionBody }}
      />
      <div className="body-base-md text-neutral-900">
        {isOpenAnswer
          ? `Instruction: Provide a brief response.`
          : `Type: ${isSingleQuestion ? "Single" : "Multiple"} select question.`}
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {isOpenAnswer ? (
          <Textarea
            {...register(`openQuestions.${questionId}`)}
            {...(!isAdmin && { onBlur: handleOpenAnswerRequest })}
            placeholder="Type your answer here"
            rows={5}
            className={cn({
              "cursor-not-allowed": isAdmin,
            })}
          />
        ) : (
          content.questionAnswers.map((answer) => (
            <button
              {...(!isAdmin && { onClick: () => handleClick(answer.id) })}
              key={answer.id}
              className={cn(
                "flex items-center space-x-3 border border-primary-200 rounded-lg py-3 px-4",
                { "cursor-not-allowed": isAdmin },
              )}
            >
              {isSingleQuestion ? (
                <Input
                  className="w-4 h-4"
                  checked={selectedOption.includes(answer.id)}
                  id={answer.id}
                  readOnly
                  type="radio"
                  value={answer.id}
                  {...register(
                    `singleAnswerQuestions.${questionId}.${answer.id}`,
                  )}
                />
              ) : (
                <Input
                  className="w-4 h-4"
                  checked={selectedOption.includes(answer.id)}
                  id={answer.id}
                  type="checkbox"
                  value={answer.id}
                  {...register(
                    `multiAnswerQuestions.${questionId}.${answer.id}`,
                  )}
                />
              )}
              <Label
                className="body-base text-neutral-950"
                htmlFor={answer.id}
                onClick={(e) => e.stopPropagation()}
              >
                {answer.optionText}
              </Label>
            </button>
          ))
        )}
      </div>
    </Card>
  );
}
