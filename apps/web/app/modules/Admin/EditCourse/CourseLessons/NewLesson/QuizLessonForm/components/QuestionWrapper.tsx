import React, { useState } from "react";
import QuestionTitle from "./QuestionTitle";
import * as Accordion from "@radix-ui/react-accordion";
import { QuestionType } from "../QuizLessonForm.types";
import { UseFormReturn } from "react-hook-form";
import { QuizLessonFormValues } from "../validators/quizLessonFormSchema";

const QuestionWrapper = ({
  questionType,
  questionIndex,
  form,
  dragTrigger,
  children,
}: {
  questionType: QuestionType;
  questionIndex: number;
  form: UseFormReturn<QuizLessonFormValues>;
  dragTrigger: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Accordion.Root type="single" collapsible>
      <Accordion.Item value={`item-${questionIndex}`}>
        <div
          className={`border p-2 mt-4 rounded-xl transition-all duration-300 ${
            isOpen ? "border-blue-500" : "border-gray-200"
          }`}
        >
          <QuestionTitle
            questionIndex={questionIndex}
            questionType={questionType}
            form={form}
            isOpen={isOpen}
            handleToggle={handleToggle}
            dragTrigger={dragTrigger}
          />
          <Accordion.Content>{children} </Accordion.Content>
        </div>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default QuestionWrapper;
