import { useState } from "react";

import Viewer from "~/components/RichText/Viever";
import { Card } from "~/components/ui/card";
import { FillInTheTextBlanks } from "~/modules/Courses/Lesson/Question/FillInTheBlanks/FillInTheTextBlanks";
import { TextBlank } from "~/modules/Courses/Lesson/Question/FillInTheBlanks/TextBlank";
import { handleCompletionForMediaLesson } from "~/utils/handleCompletionForMediaLesson";

import type { QuizQuestion } from "~/modules/Courses/Lesson/Question/types";

type Answer = {
  id: string;
  optionText: string;
  displayOrder: number | null;
  isStudentAnswer?: boolean | null;
  isCorrect?: boolean | null;
  studentAnswerText?: string | null;
};

type FillInTheBlanksProps = {
  question: QuizQuestion;
  isQuizSubmitted?: boolean;
  lessonItemId: string;
  isCompleted: boolean;
};

type Word = {
  index: number | null;
  value: string | null;
};

export const FillInTheBlanks = ({
  question,
  isQuizSubmitted,
  isCompleted,
}: FillInTheBlanksProps) => {
  const [_words, setWords] = useState<Word[]>(
    question.options!.map(({ displayOrder, studentAnswer }) => ({
      index: displayOrder,
      value: studentAnswer,
    })),
  );

  if (!question.description || !question.options?.length) return null;

  const solutionExplanation =
    "solutionExplanation" in question ? (question.solutionExplanation as string) : null;

  const maxAnswersAmount = question.description?.match(/\[word]/g)?.length ?? 0;
  const handleWordUpdate = (prevWords: Word[], index: number, value: string) => {
    const trimmedValue = value.trim();
    const existingWordIndex = prevWords.findIndex((word) => word.index === index);

    let updatedWords = prevWords;

    if (trimmedValue === "") {
      updatedWords =
        existingWordIndex !== -1 ? prevWords.filter((word) => word.index !== index) : prevWords;
    } else if (existingWordIndex !== -1) {
      updatedWords = [...prevWords];
      updatedWords[existingWordIndex] = { index, value: trimmedValue };
    } else if (prevWords.length < maxAnswersAmount) {
      updatedWords = [...prevWords, { index, value: trimmedValue }];
    }

    const sortedWords = updatedWords.sort((a, b) => a.index - b.index);

    if (sortedWords.length > 0 && sortedWords.length <= maxAnswersAmount) {
      if (
        handleCompletionForMediaLesson(isCompleted, true) &&
        sortedWords.length === maxAnswersAmount
      ) {
        // TODO: handle completion
      }
    }

    return updatedWords;
  };

  const handleOnBlur = (value: string, index: number) => {
    setWords((prev) => handleWordUpdate(prev, index, value));
  };

  return (
    <Card className="flex flex-col gap-4 p-8 border-none drop-shadow-primary">
      <div className="details text-primary-700 uppercase">Question {question.displayOrder}</div>
      <div className="h6 text-neutral-950">Fill in the blanks.</div>
      <FillInTheTextBlanks
        content={question.description}
        replacement={(index) => {
          return (
            <TextBlank
              studentAnswer={question.options?.[index]}
              index={index}
              handleOnBlur={handleOnBlur}
              isQuizSubmitted={isQuizSubmitted}
            />
          );
        }}
      />
      {!!solutionExplanation && !question.passQuestion && (
        <div>
          <span className="body-base-md text-error-700">Correct sentence:</span>
          <Viewer content={solutionExplanation} />
        </div>
      )}
    </Card>
  );
};
