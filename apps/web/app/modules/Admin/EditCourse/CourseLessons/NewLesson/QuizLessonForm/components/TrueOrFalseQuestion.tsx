import * as Accordion from "@radix-ui/react-accordion";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";

import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import QuestionTitle from "./QuestionTitle";

import type { QuizLessonFormValues } from "../validators/quizLessonFormChemat";
import type { UseFormReturn } from "react-hook-form";

type Option = {
  value: string;
  isCorrect: boolean;
  position: number;
};

type TrueOrFalseQuestionProps = {
  form: UseFormReturn<QuizLessonFormValues>;
  questionIndex: number;
};

const TrueOrFalseQuestion = ({ form, questionIndex }: TrueOrFalseQuestionProps) => {
  const questionType = form.getValues(`questions.${questionIndex}.questionType`);

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleAddOption = () => {
    const currentOptions: Option[] = form.getValues(`questions.${questionIndex}.options`) || [];
    const newOption: Option = { value: "", isCorrect: false, position: currentOptions.length + 1 };
    form.setValue(`questions.${questionIndex}.options`, [...currentOptions, newOption]);
  };

  const handleRemoveOption = (optionIndex: number) => {
    const currentOptions: Option[] = form.getValues(`questions.${questionIndex}.options`) || [];
    const updatedOptions = currentOptions.filter((_, index) => index !== optionIndex);
    form.setValue(`questions.${questionIndex}.options`, updatedOptions);
  };

  const handleRemoveQuestion = () => {
    const currentQuestions = form.getValues("questions") || [];
    const updatedQuestions = currentQuestions.filter((_, index) => index !== questionIndex);
    form.setValue("questions", updatedQuestions);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOptionChange = (optionIndex: number, field: "value" | "isCorrect", value: any) => {
    const currentOptions: Option[] = form.getValues(`questions.${questionIndex}.options`) || [];
    const updatedOptions = [...currentOptions];

    if (field === "isCorrect") {
      updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], isCorrect: value };
    } else {
      updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], value: value };
    }

    form.setValue(`questions.${questionIndex}.options`, updatedOptions);
  };

  const isOptionEmpty =
    !Array.isArray(form.getValues(`questions.${questionIndex}.options`)) ||
    form.getValues(`questions.${questionIndex}.options`)?.length === 0;

  return (
    <Accordion.Root
      key={questionIndex}
      type="single"
      collapsible
      defaultValue={`item-${questionIndex}`}
    >
      <Accordion.Item value={`item-${questionIndex}`}>
        <div
          className={`border p-4 mt-4 rounded-xl transition-all duration-300 ${!isOpen ? "border-blue-500" : "border-gray-200"}`}
        >
          <QuestionTitle
            questionIndex={questionIndex}
            questionType={questionType}
            form={form}
            isOpen={isOpen}
            handleToggle={handleToggle}
          />

          <Accordion.Content className="mt-4">
            <div className="ml-14">
              {!isOptionEmpty && (
                <>
                  <span className="text-red-500 mr-1">*</span>
                  <Label className="body-sm-md">Options</Label>
                </>
              )}
              {form.getValues(`questions.${questionIndex}.options`)?.map((option, optionIndex) => (
                <div key={optionIndex} className="mt-4">
                  <div className="border border-gray-300 p-4 rounded-xl flex items-center space-x-2">
                    <Icon name="DragAndDropIcon" className="h-7 w-7" />
                    <Input
                      type="text"
                      value={option.value}
                      onChange={(e) => handleOptionChange(optionIndex, "value", e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                      required
                    />
                    <div className="flex items-center">
                      <Input
                        type="radio"
                        name={`questions.${questionIndex}.options.${optionIndex}.isCorrect`}
                        checked={option.isCorrect === true}
                        onChange={() => handleOptionChange(optionIndex, "isCorrect", true)}
                        className="p-1 w-auto"
                      />
                      <Label className="ml-2 text-neutral-900 body-base">True</Label>
                      <Input
                        type="radio"
                        name={`questions.${questionIndex}.options.${optionIndex}.isCorrect`}
                        checked={option.isCorrect === false}
                        onChange={() => handleOptionChange(optionIndex, "isCorrect", false)}
                        className="p-1 w-auto ml-2"
                      />
                      <Label className="ml-2 text-neutral-900 body-base">False</Label>

                      <Icon
                        name="TrashIcon"
                        className="text-red-500 ml-2 cursor-pointer w-5 h-5"
                        onClick={() => handleRemoveOption(optionIndex)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4 flex gap-2">
                <Button type="button" onClick={handleAddOption}>
                  Add Option
                </Button>
                <Button
                  type="button"
                  className="text-red-500 bg-color-white border border-neutral-300"
                  onClick={handleRemoveQuestion}
                >
                  Delete Question
                </Button>
              </div>
            </div>
          </Accordion.Content>
        </div>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default TrueOrFalseQuestion;
