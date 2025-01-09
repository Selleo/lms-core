import { useParams } from "@remix-run/react";
import { type ChangeEvent, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Input } from "~/components/ui/input";
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
import type { GetLessonByIdResponse } from "~/api/generated-api";
import type { TQuestionsForm } from "~/modules/Courses/Lesson/types";
import { useTranslation } from "react-i18next";

type Questions = NonNullable<GetLessonByIdResponse["data"]["quizDetails"]>["questions"];

type QuestionProps = {
  lessonItemId: string;
  content: Questions[number];
  isSubmitted?: boolean;
  lessonType: string;
  isCompleted: boolean;
  updateLessonItemCompletion: (lessonItemId: string) => void;
};

export const Question = ({
  lessonItemId,
  isSubmitted,
  content,
  lessonType,
  isCompleted,
  updateLessonItemCompletion,
}: QuestionProps) => {
  const { lessonId = "", courseId = "" } = useParams();
  const { register, getValues } = useFormContext<TQuestionsForm>();
  const { isAdmin } = useUserRole();
  const { t } = useTranslation();

  const isQuiz = lessonType === "quiz";

  if (!lessonId) throw new Error(t("studentLessonView.error.lessonIdNotFound"));

  const questionId = content.id;
  const isTrueOrFalse = content.type === "true_or_false";
  const isSingleQuestion = content.type === "single_choice";
  const isMultiQuestion = content.type === "multiple_choice";
  const isPhotoQuestionSingleChoice = content.type === "photo_question_single_choice";
  const isPhotoQuestionMultipleChoice = content.type === "photo_question_multiple_choice";
  const isOpenAnswer = content.type === "brief_response" || content.type === "detailed_response";
  const isTextFillInTheBlanks = content.type === "fill_in_the_blanks_text";
  const isDraggableFillInTheBlanks = content.type === "fill_in_the_blanks_dnd";
  const isPhotoQuestion = isPhotoQuestionSingleChoice || isPhotoQuestionMultipleChoice;

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
      // TODO: Implement in the future
      // await sendAnswer([id]);
      handleCompletion();
    } else {
      let newSelectedOptions: string[];

      if (selectedOption.includes(id)) {
        newSelectedOptions = selectedOption.filter((option) => option !== id);
      } else {
        newSelectedOptions = [...selectedOption, id];
      }

      setSelectedOption(newSelectedOptions);
      // TODO: Implement in the future
      // await sendAnswer(newSelectedOptions);
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

  const questionNumber = content.displayOrder;

  const getFillInTheBlanksDndAnswers = () => {
    const items: DndWord[] = content.options.map(
      ({ id, optionText, displayOrder, isStudentAnswer, isCorrect, studentAnswerText }) => ({
        id,
        index: displayOrder ?? null,
        value: optionText,
        blankId: typeof displayOrder === "number" ? `blank_${displayOrder}` : "blank_preset",
        isCorrect: isCorrect,
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
          title={content.title}
          questionType={
            content.type === "brief_response"
              ? t("studentLessonView.other.briefResponseInstruction")
              : t("studentLessonView.other.detailedResponseInstruction")
          }
          questionNumber={questionNumber}
        >
          <Textarea
            {...register(`openQuestions.${questionId}`)}
            {...(!isAdmin && { onBlur: handleOpenAnswerRequest })}
            placeholder={t("studentLessonView.placeholder.openQuestion")}
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
          questionLabel={`${t("")} ${content.displayOrder}`}
          content={content.description}
          sendAnswer={sendAnswer}
          answers={content.options}
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
          questionLabel={`${t("studentLessonView.other.question")} ${content.displayOrder}`}
          content={content.description}
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
    case isSingleQuestion || isMultiQuestion || isPhotoQuestion:
      return (
        <QuestionCard
          title={content.title ?? ""}
          questionType={`${isSingleQuestion || isPhotoQuestionSingleChoice ? t("studentLessonView.other.single") : t("studentLessonView.other.multiple")} ${t("studentLessonView.other.selectQuestion")}`}
          questionNumber={questionNumber}
        >
          {isPhotoQuestion && (
            <img
              src={content.photoS3Key}
              alt=""
              className="w-full h-auto max-w-[960px] rounded-lg"
            />
          )}
          <SelectAnswer
            isQuiz={isQuiz}
            questionId={questionId}
            selectedOption={selectedOption}
            isAdmin={isAdmin}
            isSubmitted={isSubmitted}
            content={content.options}
            handleClick={handleClick}
            isMultiAnswer={isMultiQuestion || (isPhotoQuestion && isPhotoQuestionMultipleChoice)}
          />
          <QuestionCorrectAnswers
            canRenderAnswers={canRenderCorrectAnswers}
            {...("questionAnswers" in content && {
              questionAnswers: content.questionAnswers,
            })}
          />
        </QuestionCard>
      );

    case isTrueOrFalse:
      return (
        <QuestionCard
          title={content.title ?? ""}
          questionType={t("studentLessonView.other.trueOrFalseQuestion")}
          questionNumber={questionNumber}
        >
          {content.options?.map(({ optionText, id }, index) => (
            <div
              key={index}
              className="body-base text-neutral-950 w-full gap-x-4 py-3 px-4 border border-neutral-200 rounded-lg flex"
            >
              <div className="w-full">{optionText}</div>
              <div className="flex gap-x-4">
                <label className="flex items-center gap-x-1">
                  <Input
                    className="size-4"
                    readOnly
                    type="radio"
                    value="true"
                    {...register(`singleAnswerQuestions.${questionId}.${id}`)}
                    name={`trueOrFalseQuestions.${questionId}.${id}`}
                  />{" "}
                  {t("studentLessonView.other.true")}
                </label>
                <label className="flex items-center gap-x-1">
                  <Input
                    className="size-4"
                    {...register(`singleAnswerQuestions.${questionId}.${id}`)}
                    name={`trueOrFalseQuestions.${questionId}.${id}`}
                    readOnly
                    type="radio"
                    value="false"
                  />{" "}
                  {t("studentLessonView.other.false")}
                </label>
              </div>
            </div>
          ))}
        </QuestionCard>
      );

    default:
      return null;
  }
};
