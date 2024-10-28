import { useEffect, useState } from "react";
import { Card } from "~/components/ui/card";
import { FillInTheTextBlanks } from "~/modules/Courses/Lesson/LessonItems/FillInTheBlanks/FillInTheTextBlanks";
import { TextBlank } from "~/modules/Courses/Lesson/LessonItems/FillInTheBlanks/TextBlank";

type FillTheBlanksProps = {
  isQuiz: boolean;
  content: string;
  sendAnswer: (selectedOption: Word[]) => Promise<void>;
  answers: {
    id: string;
    optionText: string;
    position: number | null;
    isStudentAnswer?: boolean | null;
    isCorrect?: boolean | null;
    studentAnswerText?: string;
  }[];
  questionLabel: string;
};

type Word = {
  index: number;
  value: string;
};

export const FillTheBlanks = ({
  isQuiz = false,
  questionLabel,
  content,
  sendAnswer,
  answers,
}: FillTheBlanksProps) => {
  const [words, setWords] = useState<Word[]>(
    answers.map(({ position, studentAnswerText }) => ({
      index: position ?? 0,
      value: studentAnswerText ?? "",
    })),
  );
  const maxAnswersAmount = content.match(/\[word]/g)?.length ?? 0;

  useEffect(() => {
    if (words.length >= 1 && words.length <= maxAnswersAmount) {
      const sortedWords = words.sort((a, b) => a.index - b.index);
      if (sortedWords.length > 0 && sortedWords.length <= maxAnswersAmount) {
        sendAnswer(sortedWords);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words]);

  const handleWordUpdate = (
    prevWords: Word[],
    index: number,
    value: string,
  ) => {
    const trimmedValue = value.trim();
    const existingWordIndex = prevWords.findIndex(
      (word) => word.index === index,
    );
    if (trimmedValue === "") {
      if (!prevWords?.length) return [{ index, value }];

      return existingWordIndex !== -1
        ? prevWords.filter((word) => word.index !== index)
        : prevWords;
    }

    if (existingWordIndex !== -1) {
      const updatedWords = [...prevWords];
      updatedWords[existingWordIndex] = { index, value: trimmedValue };
      return updatedWords;
    }

    if (prevWords.length < maxAnswersAmount) {
      return [...prevWords, { index, value: trimmedValue }];
    }

    return prevWords;
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
            />
          );
        }}
      />
    </Card>
  );
};
