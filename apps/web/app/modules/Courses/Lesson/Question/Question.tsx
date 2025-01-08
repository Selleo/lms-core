import { useParams } from "@remix-run/react";

import { BriefResponse } from "./BriefResponse";
import { DetailedResponse } from "./DetailedResponse";
import { FillInTheBlanksDnd } from "./FillInTheBlanks/dnd/FillInTheBlanksDnd";
import { FillInTheBlanks } from "./FillInTheBlanks/FillInTheBlanks";
import { MultipleChoice } from "./MultipleChoice";
import { PhotoQuestionMultipleChoice } from "./PhotoQuestionMultipleChoice";
import { PhotoQuestionSingleChoice } from "./PhotoQuestionSingleChoice";
import { SingleChoice } from "./SingleChoice/SingleChoice";
import { TrueOrFalse } from "./TrueOrFalse";

import type { DndWord } from "./FillInTheBlanks/dnd/types";
import type { GetLessonByIdResponse } from "~/api/generated-api";

type Questions = NonNullable<GetLessonByIdResponse["data"]["quizDetails"]>["questions"];

type QuestionProps = {
  question: Questions[number];
  isSubmitted?: boolean;
  isCompleted: boolean;
};

export const Question = ({ isSubmitted, question, isCompleted }: QuestionProps) => {
  const { lessonId = "" } = useParams();

  if (!lessonId) throw new Error("Lesson ID not found");

  const questionId = question.id;
  const isTrueOrFalse = question.type === "true_or_false";
  const isSingleQuestion = question.type === "single_choice";
  const isMultiQuestion = question.type === "multiple_choice";
  const isPhotoQuestionSingleChoice = question.type === "photo_question_single_choice";
  const isPhotoQuestionMultipleChoice = question.type === "photo_question_multiple_choice";

  const isBriefResponse = question.type === "brief_response";
  const isDetailedResponse = question.type === "detailed_response";
  const isTextFillInTheBlanks = question.type === "fill_in_the_blanks_text";
  const isDraggableFillInTheBlanks = question.type === "fill_in_the_blanks_dnd";

  const getFillInTheBlanksDndAnswers = () => {
    const items: DndWord[] = question.options?.map(
      ({ id, optionText, displayOrder, isStudentAnswer, isCorrect, studentAnswer }) => ({
        id,
        index: displayOrder ?? null,
        value: optionText,
        blankId: typeof displayOrder === "number" ? `blank_${displayOrder}` : "blank_preset",
        isCorrect: isCorrect,
        isStudentAnswer,
        studentAnswerText: studentAnswer,
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
    case isBriefResponse:
      return <BriefResponse question={question} />;
    case isDetailedResponse:
      return <DetailedResponse question={question} />;

    case isTextFillInTheBlanks:
      return (
        <FillInTheBlanks
          question={question}
          isQuizSubmitted={isSubmitted}
          lessonItemId={questionId}
          isCompleted={isCompleted}
        />
      );

    case isDraggableFillInTheBlanks:
      return (
        <FillInTheBlanksDnd
          questionLabel={`question ${question.displayOrder}`}
          content={question.description}
          answers={fillInTheBlanksDndData}
          isQuizSubmitted={isSubmitted}
          solutionExplanation={
            "solutionExplanation" in question ? question.solutionExplanation : null
          }
          isPassed={!!question.passQuestion}
          lessonItemId={questionId}
          isCompleted={isCompleted}
          updateLessonItemCompletion={() => {}}
        />
      );
    case isSingleQuestion:
      return <SingleChoice question={question} isQuizCompleted={true} />;

    case isMultiQuestion:
      return <MultipleChoice question={question} isQuizCompleted={true} />;

    case isPhotoQuestionSingleChoice:
      return <PhotoQuestionSingleChoice question={question} isQuizCompleted={true} />;

    case isPhotoQuestionMultipleChoice:
      return <PhotoQuestionMultipleChoice question={question} isQuizCompleted={true} />;

    case isTrueOrFalse:
      return <TrueOrFalse question={question} />;

    default:
      return null;
  }
};
