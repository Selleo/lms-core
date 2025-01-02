import React from "react";
import QuestionTitle from "./QuestionTitle";
import { Question, QuestionType } from "../QuizLessonForm.types";
import { UseFormReturn } from "react-hook-form";
import { QuizLessonFormValues } from "../validators/quizLessonFormSchema";
import { cn } from "~/lib/utils";
import { Accordion, AccordionContent, AccordionItem } from "~/components/ui/accordion";

const QuestionWrapper = ({
  questionType,
  questionIndex,
  form,
  dragTrigger,
  children,
  item,
  isOpen,
  handleToggle,
}: {
  questionType: QuestionType;
  questionIndex: number;
  form: UseFormReturn<QuizLessonFormValues>;
  dragTrigger: React.ReactNode;
  children: React.ReactNode;
  item: Question;
  isOpen: boolean;
  handleToggle: () => void;
}) => {
  const isOpenQuestion =
    questionType === QuestionType.BRIEF_RESPONSE || questionType === QuestionType.DETAILED_RESPONSE;

  return (
    <Accordion type="single" collapsible value={isOpen ? `item-${questionIndex}` : undefined}>
      <AccordionItem value={`item-${questionIndex}`}>
        <div
          className={cn(
            "border p-2 mt-4 rounded-xl transition-all duration-300",
            isOpen && !isOpenQuestion ? "border-blue-500" : "border-gray-200",
          )}
        >
          <QuestionTitle
            questionIndex={questionIndex}
            questionType={questionType}
            form={form}
            isOpen={isOpen}
            handleToggle={handleToggle}
            dragTrigger={dragTrigger}
            item={item}
            isOpenQuestion={isOpenQuestion}
          />
          {isOpen && <AccordionContent>{children}</AccordionContent>}
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default QuestionWrapper;
