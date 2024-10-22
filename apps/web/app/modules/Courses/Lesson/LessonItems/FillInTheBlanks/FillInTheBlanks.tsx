import { useEffect, useState } from "react";
import { Card } from "~/components/ui/card";
import { FillInTheTextBlanks } from "~/modules/Courses/Lesson/LessonItems/FillInTheBlanks/FillInTheTextBlanks";
import { TextBlank } from "~/modules/Courses/Lesson/LessonItems/FillInTheBlanks/TextBlank";

type FillTheBlanksProps = {
  content: string;
  sendAnswer: (selectedOption: Word[]) => Promise<void>;
  answers: {
    id: string;
    optionText: string;
    position: number | null;
  }[];
  questionLabel: string;
};

const MAX_ANSWERS_AMOUNT = 2;

type Word = {
  index: number;
  value: string;
};

export const FillTheBlanks = ({
  questionLabel,
  content,
  sendAnswer,
  answers,
}: FillTheBlanksProps) => {
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    if (words.length >= 1 && words.length <= MAX_ANSWERS_AMOUNT) {
      const sortedWords = words.sort((a, b) => a.index - b.index);
      if (sortedWords.length > 0 && sortedWords.length <= MAX_ANSWERS_AMOUNT) {
        sendAnswer(sortedWords);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words]);

  const handleWordUpdate = (
    prevWords: Word[],
    index: number,
    value: string
  ) => {
    const trimmedValue = value.trim();
    const existingWordIndex = prevWords.findIndex(
      (word) => word.index === index
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

    if (prevWords.length < MAX_ANSWERS_AMOUNT) {
      return [...prevWords, { index, value: trimmedValue }];
    }

    return prevWords;
  };

  const handleOnBlur = (value: string, index: number) => {
    setWords((prev) => handleWordUpdate(prev, index + 1, value));
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
              studentAnswer={answers[index]?.optionText}
              index={index}
              handleOnBlur={handleOnBlur}
            />
          );
        }}
      />
    </Card>
  );
};
