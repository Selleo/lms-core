import { useParams } from "@remix-run/react";
import { useState } from "react";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useQuestionQuery } from "./useQuestionQuery";
import type { TQuestionsForm } from "../types";
import { useCompletedLessonItemsStore } from "./LessonItemStore";
import type { UseFormRegister } from "react-hook-form";

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
  questionsArray: string[];
  register: UseFormRegister<TQuestionsForm>;
};

export default function Questions({
  content,
  questionsArray,
  register,
}: TProps) {
  const { markLessonItemAsCompleted } = useCompletedLessonItemsStore();
  const { lessonId } = useParams();

  if (!lessonId) throw new Error("Lesson ID not found");

  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [openQuestion, setOpenQuestion] = useState("");
  const isSingleQuestion = content.questionType === "single_choice";
  const isOpenAnswer = content.questionType === "open_answer";
  const questionId = content.id;

  useQuestionQuery({
    lessonId,
    questionId,
    openQuestion,
    selectedOption,
    isOpenAnswer,
  });

  const handleClick = async (id: string) => {
    markLessonItemAsCompleted(questionId);

    if (isSingleQuestion) {
      setSelectedOption([id]);
    } else {
      let newSelectedOptions: string[];
      if (selectedOption.includes(id)) {
        newSelectedOptions = selectedOption.filter((option) => option !== id);
      } else {
        newSelectedOptions = [...selectedOption, id];
      }
      setSelectedOption(newSelectedOptions);
    }
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
            onBlur={(e) => {
              markLessonItemAsCompleted(questionId);
              setOpenQuestion(e.target.value);
            }}
            placeholder="Type your answer here"
            rows={5}
          />
        ) : (
          content.questionAnswers.map((answer) => (
            <button
              onClick={() => handleClick(answer.id)}
              key={answer.id}
              className="flex items-center space-x-3 border border-primary-200 rounded-lg py-3 px-4"
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
                    `singleAnswerQuestions.${questionId}.${answer.id}`
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
                    `multiAnswerQuestions.${questionId}.${answer.id}`
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
