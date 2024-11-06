import { useParams } from "@remix-run/react";
import { type ChangeEvent, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { useLesson } from "~/api/queries";
import { Textarea } from "~/components/ui/textarea";
import { useUserRole } from "~/hooks/useUserRole";
import { cn } from "~/lib/utils";

import { FillInTheBlanksDnd } from "../FillInTheBlanks/dnd/FillInTheBlanksDnd";
import { FillTheBlanks } from "../FillInTheBlanks/FillInTheBlanks";
import { useCompletedLessonItemsStore } from "../LessonItemStore";
import { useQuestionQuery } from "../useQuestionQuery";
import { getQuestionDefaultValue } from "../utils";

import { QuestionCard } from "./QuestionCard";
import { QuestionCorrectAnswers } from "./QuestionCorrectAnswers";
import { SelectAnswer } from "./SelectAnswer";

import type { DndWord } from "../FillInTheBlanks/dnd/types";
import type { GetLessonResponse } from "~/api/generated-api";
import type { TQuestionsForm } from "~/modules/Courses/Lesson/types";

type QuestionProps = {
  id: string;
  content: GetLessonResponse["data"]["lessonItems"][number]["content"];
  questionsArray: string[];
  isSubmitted?: boolean;
};

export const Question = ({ isSubmitted, content, questionsArray }: QuestionProps) => {
  const { lessonId } = useParams();
  const { register, getValues } = useFormContext<TQuestionsForm>();
  const { isAdmin } = useUserRole();
  const { data: lesson } = useLesson(lessonId ?? "");

  const isQuiz = lesson?.type === "quiz";

  if (!lessonId) throw new Error("Lesson ID not found");

  const { markLessonItemAsCompleted } = useCompletedLessonItemsStore();

  const questionId = content.id;
  const isSingleQuestion = "questionType" in content && content.questionType === "single_choice";
  const isMultiQuestion = "questionType" in content && content.questionType === "multiple_choice";
  const isOpenAnswer = "questionType" in content && content.questionType === "open_answer";
  const isTextFillInTheBlanks =
    "questionType" in content && content.questionType === "fill_in_the_blanks_text";
  const isDraggableFillInTheBlanks =
    "questionType" in content && content.questionType === "fill_in_the_blanks_dnd";

  const { sendAnswer, sendOpenAnswer } = useQuestionQuery({
    lessonId,
    questionId,
  });

  const [selectedOption, setSelectedOption] = useState<string[]>(() =>
    getQuestionDefaultValue({ getValues, questionId, isSingleQuestion }),
  );

  useEffect(() => {
    if (isQuiz && !isSubmitted) {
      setSelectedOption([]);
    }
  }, [isQuiz, isSubmitted]);

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

  const handleOpenAnswerRequest = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    await markLessonItemAsCompleted({
      lessonItemId: questionId,
      lessonId,
    });
    await sendOpenAnswer(e.target.value);
  };

  const canRenderCorrectAnswers =
    "questionAnswers" in content
      ? content.questionAnswers.some(
          ({ isCorrect, isStudentAnswer }) =>
            (isCorrect && !isStudentAnswer) ||
            (!isCorrect && isStudentAnswer && isCorrect !== null),
        )
      : false;

  const questionNumber = questionsArray.indexOf(questionId) + 1;

  const getFillInTheBlanksDndAnswers = () => {
    if ("questionAnswers" in content && isDraggableFillInTheBlanks) {
      const items: DndWord[] = [];

      for (const {
        id,
        optionText,
        position,
        isStudentAnswer,
        isCorrect,
        studentAnswerText,
      } of content.questionAnswers) {
        if (studentAnswerText && studentAnswerText !== optionText) {
          items.push({
            id,
            index: null,
            value: optionText,
            blankId: "blank_preset",
            isCorrect,
            isStudentAnswer,
          });
        }

        items.push({
          id,
          index: position,
          value: optionText,
          studentAnswerText,
          blankId: typeof position === "number" ? `blank_${position}` : "blank_preset",
          isCorrect,
          isStudentAnswer,
        });
      }

      const studentAnswers = items.reduce<string[]>((acc, item) => {
        if (item?.studentAnswerText && item.studentAnswerText !== item.value) {
          acc.push(item.studentAnswerText);
        }

        return acc;
      }, []);

      return items.filter(({ value }) => !studentAnswers.includes(value));
    }

    return [] as DndWord[];
  };

  const fillInTheBlanksDndData = getFillInTheBlanksDndAnswers();

  switch (true) {
    case isOpenAnswer:
      return (
        <QuestionCard
          title={"questionBody" in content ? content.questionBody : ""}
          questionType="Provide a brief response."
          questionNumber={questionNumber}
        >
          <Textarea
            {...register(`openQuestions.${questionId}`)}
            {...(!isAdmin && { onBlur: handleOpenAnswerRequest })}
            placeholder="Type your answer here"
            rows={5}
            className={cn({
              "cursor-not-allowed": isAdmin,
            })}
          />
        </QuestionCard>
      );

    case isTextFillInTheBlanks:
      return (
        <FillTheBlanks
          isQuiz={isQuiz}
          questionLabel={`question ${questionsArray.indexOf(questionId) + 1}`}
          content={content.questionBody}
          sendAnswer={sendAnswer}
          answers={content.questionAnswers}
          isQuizSubmitted={lesson?.isSubmitted}
          solutionExplanation={
            "solutionExplanation" in content ? content.solutionExplanation : null
          }
          isPassed={!!content.passQuestion}
        />
      );

    case isDraggableFillInTheBlanks:
      return (
        <FillInTheBlanksDnd
          isQuiz={isQuiz}
          questionLabel={`question ${questionsArray.indexOf(questionId) + 1}`}
          content={content.questionBody}
          sendAnswer={sendAnswer}
          answers={fillInTheBlanksDndData}
          isQuizSubmitted={lesson?.isSubmitted}
          solutionExplanation={
            "solutionExplanation" in content ? content.solutionExplanation : null
          }
          isPassed={!!content.passQuestion}
        />
      );

    case isSingleQuestion || isMultiQuestion:
      return (
        <QuestionCard
          title={"questionBody" in content ? content.questionBody : ""}
          questionType={`${isSingleQuestion ? "Single" : "Multiple"} select question.`}
          questionNumber={questionNumber}
        >
          <SelectAnswer
            isQuiz={isQuiz}
            questionId={questionId}
            selectedOption={selectedOption}
            isAdmin={isAdmin}
            isSubmitted={isSubmitted}
            content={content}
            handleClick={handleClick}
            isMultiAnswer={isMultiQuestion}
          />
          <QuestionCorrectAnswers
            canRenderAnswers={canRenderCorrectAnswers}
            {...("questionAnswers" in content && {
              questionAnswers: content.questionAnswers,
            })}
          />
        </QuestionCard>
      );

    default:
      return null;
  }
};
