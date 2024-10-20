import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { getQuestionDefaultValue } from "./utils";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useCompletedLessonItemsStore } from "./LessonItemStore";
import { useParams } from "@remix-run/react";
import { useQuestionQuery } from "./useQuestionQuery";
import React, { useState } from "react";
import type { TQuestionsForm } from "../types";
import type { UseFormGetValues, UseFormRegister } from "react-hook-form";
import { cx } from "class-variance-authority";
import { FillTheBlanks } from "~/modules/Courses/Lesson/LessonItems/FillInTheBlanks/FillInTheBlanks";
import { FillInTheBlanksDnd } from "~/modules/Courses/Lesson/LessonItems/FillInTheBlanks/dnd/FillInTheBlanksDnd";

type TProps = {
  content: {
    id: string;
    questionType: string;
    questionBody: string;
    questionAnswers: {
      id: string;
      isStudentAnswer: boolean;
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
  const isFillInTheBlanks = content.questionType === "fill_in_the_blanks";
  const isSingleQuestion = content.questionType === "single_choice";
  const isOpenAnswer = content.questionType === "open_answer";
  console.log({ content });
  const { sendAnswer, sendOpenAnswer } = useQuestionQuery({
    lessonId,
    questionId,
  });

  const [selectedOption, setSelectedOption] = useState<string[]>(() =>
    getQuestionDefaultValue({ getValues, questionId, isSingleQuestion }),
  );

  const handleClick = async (id: string) => {
    await markLessonItemAsCompleted({ lessonItemId: questionId, lessonId });

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
    await markLessonItemAsCompleted({
      lessonItemId: questionId,
      lessonId,
    });
    await sendOpenAnswer(e.target.value);
  };

  const classesMap = {
    base: "border-primary-200",
    success: "border-green-500 bg-green-500/10",
    wrong: "border-red-500 bg-red-500/10",
  };

  const renderCheckbox = (answer: {
    id: string;
    optionText: string;
    position: number | null;
  }) => {
    if (isSingleQuestion) {
      return (
        <Input
          className="w-4 h-4"
          checked={selectedOption.includes(answer.id)}
          id={answer.id}
          readOnly
          type="radio"
          value={answer.id}
          {...register(`singleAnswerQuestions.${questionId}.${answer.id}`)}
        />
      );
    }

    return (
      <Input
        className={cx("w-4 h-4", classesMap.success)}
        checked={selectedOption.includes(answer.id)}
        id={answer.id}
        type="checkbox"
        value={answer.id}
        {...register(`multiAnswerQuestions.${questionId}.${answer.id}`)}
      />
    );
  };

  const renderAnswers = () => {
    if (isOpenAnswer) {
      return (
        <Textarea
          {...register(`openQuestions.${questionId}`)}
          {...(!isAdmin && { onBlur: handleOpenAnswerRequest })}
          placeholder="Type your answer here"
          rows={5}
          className={cn({
            "cursor-not-allowed": isAdmin,
          })}
        />
      );
    }

    return content.questionAnswers.map((answer) => {
      const marker = renderCheckbox(answer);

      return (
        <button
          {...(!isAdmin && { onClick: () => handleClick(answer.id) })}
          key={answer.id}
          className={cn(
            "flex items-center space-x-3 border rounded-lg py-3 px-4",
            { "cursor-not-allowed": isAdmin },
            classesMap.base,
          )}
        >
          {marker}
          <Label
            className="body-base text-neutral-950"
            htmlFor={answer.id}
            onClick={(e) => e.stopPropagation()}
          >
            {answer.optionText}
          </Label>
        </button>
      );
    });
  };

  const answers = renderAnswers();
  console.log(content);
  if (isFillInTheBlanks) {
    return (
      <>
        <Card className="flex flex-col gap-4 p-8 border-none drop-shadow-primary">
          <div className="details text-primary-700 uppercase">{`question 0`}</div>
          <div className="h6 text-neutral-950">
            Decerno audeo tam altus aequus.
          </div>
          <FillInTheBlanksDnd
            content={content.questionBody}
            sendAnswer={sendAnswer}
            answers={content.questionAnswers}
            register={register}
            questionId={questionId}
          />
        </Card>
        <FillTheBlanks
          content={content.questionBody}
          sendAnswer={sendAnswer}
          answers={content.questionAnswers}
          register={register}
          questionId={questionId}
        />
      </>
    );
  }

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
      <div className="flex flex-col gap-4 mt-4">{answers}</div>
    </Card>
  );
}
