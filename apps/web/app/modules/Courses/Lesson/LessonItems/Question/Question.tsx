import { useParams } from "@remix-run/react";
import { type ChangeEvent, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Textarea } from "~/components/ui/textarea";
import { useUserRole } from "~/hooks/useUserRole";
import { cn } from "~/lib/utils";
import { handleCompletionForMediaLesson } from "~/utils/handleCompletionForMediaLesson";

import { FillInTheBlanksDnd } from "../FillInTheBlanks/dnd/FillInTheBlanksDnd";
import { FillInTheBlanks } from "../FillInTheBlanks/FillInTheBlanks";
import { useQuestionQuery } from "../useQuestionQuery";
import { getQuestionDefaultValue } from "../utils";

import { QuestionCard } from "./QuestionCard";
import { QuestionCorrectAnswers } from "./QuestionCorrectAnswers";
import { SelectAnswer } from "./SelectAnswer";

import type { DndWord } from "../FillInTheBlanks/dnd/types";
import type { GetLessonResponse } from "~/api/generated-api";
import type { TQuestionsForm } from "~/modules/Courses/Lesson/types";

type QuestionProps = {
  lessonItemId: string;
  content: GetLessonResponse["data"]["lessonItems"][number]["content"];
  questionsArray: string[];
  isSubmitted?: boolean;
  lessonType: string;
  isCompleted: boolean;
  updateLessonItemCompletion: (lessonItemId: string) => void;
};

export const Question = ({
  lessonItemId,
  isSubmitted,
  content,
  questionsArray,
  lessonType,
  isCompleted,
  updateLessonItemCompletion,
}: QuestionProps) => {
  const { lessonId = "", courseId = "" } = useParams();
  const { register, getValues } = useFormContext<TQuestionsForm>();
  const { isAdmin } = useUserRole();

  const isQuiz = lessonType === "quiz";

  if (!lessonId) throw new Error("Lesson ID not found");

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
    courseId,
  });

  const [selectedOption, setSelectedOption] = useState<string[]>(() =>
    getQuestionDefaultValue({ getValues, questionId, isSingleQuestion }),
  );

  useEffect(() => {
    if (isQuiz && !isSubmitted) {
      setSelectedOption([]);
    }
  }, [isQuiz, isSubmitted]);

  const handleCompletion = () =>
    handleCompletionForMediaLesson(isCompleted, isQuiz) && updateLessonItemCompletion(lessonItemId);

  const handleClick = async (id: string) => {
    if (isSingleQuestion) {
      setSelectedOption([id]);
      await sendAnswer([id]);
      handleCompletion();
    } else {
      let newSelectedOptions: string[];

      if (selectedOption.includes(id)) {
        newSelectedOptions = selectedOption.filter((option) => option !== id);
      } else {
        newSelectedOptions = [...selectedOption, id];
      }

      setSelectedOption(newSelectedOptions);
      await sendAnswer(newSelectedOptions);
      handleCompletion();
    }
  };

  const handleOpenAnswerRequest = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    await sendOpenAnswer(e.target.value);
    handleCompletion();
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
    if (!("questionAnswers" in content) || !isDraggableFillInTheBlanks) {
      return [];
    }

    const items: DndWord[] = content.questionAnswers.map(
      ({ id, optionText, displayOrder, isStudentAnswer, isCorrect, studentAnswerText }) => ({
        id,
        index: displayOrder ?? null,
        value: optionText,
        blankId: typeof displayOrder === "number" ? `blank_${displayOrder}` : "blank_preset",
        isCorrect,
        isStudentAnswer,
        studentAnswerText,
      }),
    );

    return items.reduce<DndWord[]>((acc, item) => {
      if (!acc.some(({ value }) => value === item.value)) {
        acc.push(item);
      }

      return acc;
    }, []);
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
        <FillInTheBlanks
          isQuiz={isQuiz}
          questionLabel={`question ${questionsArray.indexOf(questionId) + 1}`}
          content={content.questionBody}
          sendAnswer={sendAnswer}
          answers={content.questionAnswers}
          isQuizSubmitted={isSubmitted}
          solutionExplanation={
            "solutionExplanation" in content ? content.solutionExplanation : null
          }
          isPassed={!!content.passQuestion}
          lessonItemId={lessonItemId}
          isCompleted={isCompleted}
          updateLessonItemCompletion={updateLessonItemCompletion}
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
          isQuizSubmitted={isSubmitted}
          solutionExplanation={
            "solutionExplanation" in content ? content.solutionExplanation : null
          }
          isPassed={!!content.passQuestion}
          lessonItemId={lessonItemId}
          isCompleted={isCompleted}
          updateLessonItemCompletion={updateLessonItemCompletion}
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
