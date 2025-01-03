import { useState } from "react";

import Viewer from "~/components/RichText/Viever";
import { Card } from "~/components/ui/card";
import { FillInTheTextBlanks } from "~/modules/Courses/Lesson/LessonItems/FillInTheBlanks/FillInTheTextBlanks";
import { TextBlank } from "~/modules/Courses/Lesson/LessonItems/FillInTheBlanks/TextBlank";
import { handleCompletionForMediaLesson } from "~/utils/handleCompletionForMediaLesson";

type Answer = {
  id: string;
  optionText: string;
  displayOrder: number | null;
  isStudentAnswer?: boolean | null;
  isCorrect?: boolean | null;
  studentAnswerText?: string | null;
};

type FillInTheBlanksProps = {
  isQuiz: boolean;
  content: string;
  sendAnswer: (selectedOption: Word[]) => Promise<void>;
  answers: Answer[];
  questionLabel: string;
  isQuizSubmitted?: boolean;
  solutionExplanation?: string | null;
  isPassed: boolean | null;
  lessonItemId: string;
  isCompleted: boolean;
  updateLessonItemCompletion: (lessonItemId: string) => void;
};

type Word = {
  index: number;
  value: string;
};

export const FillInTheBlanks = ({
  isQuiz = false,
  questionLabel,
  content,
  sendAnswer,
  answers,
  isQuizSubmitted,
  solutionExplanation,
  isPassed,
  lessonItemId,
  isCompleted,
  updateLessonItemCompletion,
}: FillInTheBlanksProps) => {
  const [_words, setWords] = useState<Word[]>(
    answers.map(({ displayOrder, studentAnswerText }) => ({
      index: displayOrder ?? 0,
      value: studentAnswerText ?? "",
    })),
  );

  const maxAnswersAmount = content?.match(/\[word]/g)?.length ?? 0;

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
      sendAnswer(sortedWords);
      if (
        handleCompletionForMediaLesson(isCompleted, isQuiz) &&
        sortedWords.length === maxAnswersAmount
      ) {
        updateLessonItemCompletion(lessonItemId);
      }
    }

    return updatedWords;
  };

  const handleOnBlur = (value: string, index: number) => {
    setWords((prev) => handleWordUpdate(prev, index, value));
  };

  return (
    <Card className="flex flex-col gap-4 p-8 border-none drop-shadow-primary">
      <div className="details text-primary-700 uppercase">{questionLabel}</div>
      <div className="h6 text-neutral-950">Fill in the blanks.</div>
      <FillInTheTextBlanks
        content={content}
        replacement={(index) => {
          return (
            <TextBlank
              isQuiz={isQuiz}
              studentAnswer={answers[index]}
              index={index}
              handleOnBlur={handleOnBlur}
              isQuizSubmitted={isQuizSubmitted}
            />
          );
        }}
      />
      {solutionExplanation && !isPassed && (
        <div>
          <span className="body-base-md text-error-700">Correct sentence:</span>
          <Viewer content={solutionExplanation} />
        </div>
      )}
    </Card>
  );
};
