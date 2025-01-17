import Viewer from "~/components/RichText/Viever";
import { Card } from "~/components/ui/card";

import { FillInTheTextBlanks } from "./FillInTheTextBlanks";
import { TextBlank } from "./TextBlank";

import type { QuizQuestion } from "../types";

type FillInTheBlanksProps = {
  question: QuizQuestion;
  isCompleted: boolean;
};

export const FillInTheBlanks = ({ question, isCompleted }: FillInTheBlanksProps) => {
  if (!question.description) return null;

  return (
    <Card className="flex flex-col gap-4 border-none p-8 drop-shadow-primary">
      <div className="details uppercase text-primary-700">Question {question.displayOrder}</div>
      <div className="h6 text-neutral-950">Fill in the blanks.</div>
      <FillInTheTextBlanks
        content={question.description}
        replacement={(index) => {
          return (
            <TextBlank
              questionId={question.id}
              studentAnswer={question.options?.[index]}
              index={index}
              isQuizSubmitted={isCompleted}
            />
          );
        }}
      />
      {isCompleted && !!question?.solutionExplanation && (
        <div>
          <span className="body-base-md text-error-700">Correct sentence:</span>
          <Viewer content={question.solutionExplanation} />
        </div>
      )}
    </Card>
  );
};
