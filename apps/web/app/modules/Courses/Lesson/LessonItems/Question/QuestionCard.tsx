import type { ReactNode } from "react";

type QuestionCardProps = {
  questionNumber: number;
  title: string;
  questionType: string;
  children: ReactNode;
};

export const QuestionCard = ({
  children,
  questionNumber,
  questionType,
  title,
}: QuestionCardProps) => {
  return (
    <div className="flex flex-col gap-2 p-8 border border-neutral-200 bg-white rounded-lg">
      <div className="details text-primary-700 uppercase">Question {questionNumber}</div>
      <div className="h6 text-neutral-950" dangerouslySetInnerHTML={{ __html: title }} />
      <div className="body-base text-neutral-900">{questionType}</div>
      <div className="flex flex-col gap-4 mt-4">{children}</div>
    </div>
  );
};
