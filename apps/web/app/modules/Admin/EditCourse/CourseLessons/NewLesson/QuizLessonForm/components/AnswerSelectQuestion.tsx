import * as Accordion from "@radix-ui/react-accordion";
import { Label } from "@radix-ui/react-label";
import { useCallback, useMemo, useState } from "react";

import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import QuestionTitle from "./QuestionTitle";

import type { QuizLessonFormValues } from "../validators/quizLessonFormSchema";
import type { UseFormReturn } from "react-hook-form";
import { QuestionOption, QuestionType } from "../QuizLessonForm.types";
import { cn } from "~/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "~/components/ui/tooltip";

type AnswerSelectQuestionProps = {
  form: UseFormReturn<QuizLessonFormValues>;
  questionIndex: number;
};

const AnswerSelectQuestion = ({ form, questionIndex }: AnswerSelectQuestionProps) => {
  const questionType = form.getValues(`questions.${questionIndex}.type`);

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleAddOption = useCallback(() => {
    const currentOptions: QuestionOption[] =
      form.getValues(`questions.${questionIndex}.options`) || [];
    const newOption: QuestionOption = {
      optionText: "",
      isCorrect: false,
      position: currentOptions.length + 1,
    };
    form.setValue(`questions.${questionIndex}.options`, [...currentOptions, newOption]);
  }, [form, questionIndex]);

  const handleRemoveOption = useCallback(
    (optionIndex: number) => {
      const currentOptions: QuestionOption[] =
        form.getValues(`questions.${questionIndex}.options`) || [];
      const updatedOptions = currentOptions.filter((_, index) => index !== optionIndex);
      form.setValue(`questions.${questionIndex}.options`, updatedOptions);
    },
    [form, questionIndex],
  );

  const handleRemoveQuestion = useCallback(() => {
    const currentQuestions = form.getValues("questions") || [];
    const updatedQuestions = currentQuestions.filter((_, index) => index !== questionIndex);
    form.setValue("questions", updatedQuestions);
  }, [form, questionIndex]);

  const handleOptionChange = useCallback(
    (optionIndex: number, field: "optionText" | "isCorrect", value: string | boolean) => {
      const currentOptions: QuestionOption[] =
        form.getValues(`questions.${questionIndex}.options`) || [];
      const updatedOptions = [...currentOptions];

      if (field === "isCorrect") {
        if (questionType === QuestionType.SINGLE_CHOICE) {
          updatedOptions.forEach((option, index) => {
            if (index !== optionIndex) option.isCorrect = false;
          });
        }
      }

      updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], [field]: value };
      form.setValue(`questions.${questionIndex}.options`, updatedOptions);
    },
    [form, questionIndex, questionType],
  );

  const isOptionEmpty =
    !Array.isArray(form.getValues(`questions.${questionIndex}.options`)) ||
    form.getValues(`questions.${questionIndex}.options`)?.length === 0;

  return (
    <Accordion.Root key={questionIndex} type="single" collapsible>
      <Accordion.Item value={`item-${questionIndex}`}>
        <div
          className={cn("border p-2 mt-4 rounded-xl transition-all duration-300", {
            "border-blue-500": isOpen,
            "border-gray-200": !isOpen,
          })}
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
                      value={option.optionText}
                      onChange={(e) =>
                        handleOptionChange(optionIndex, "optionText", e.target.value)
                      }
                      placeholder={`Option ${optionIndex + 1}`}
                      required
                      className="flex-1"
                    />
                    <div className="flex items-center">
                      {questionType === QuestionType.SINGLE_CHOICE ? (
                        <Input
                          type="radio"
                          className="w-5 h-5 cursor-pointer ml-3"
                          name={`questions.${questionIndex}.correctOption`}
                          checked={option.isCorrect}
                          onChange={() =>
                            handleOptionChange(optionIndex, "isCorrect", !option.isCorrect)
                          }
                        />
                      ) : (
                        <Input
                          type="checkbox"
                          className="w-5 h-5 cursor-pointer ml-3"
                          checked={option.isCorrect}
                          onChange={() =>
                            handleOptionChange(optionIndex, "isCorrect", !option.isCorrect)
                          }
                        />
                      )}
                      <Label
                        className="ml-2 cursor-pointer"
                        onClick={() =>
                          handleOptionChange(optionIndex, "isCorrect", !option.isCorrect)
                        }
                      >
                        Correct
                      </Label>
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Icon
                                name="TrashIcon"
                                className="text-error-500 ml-3 cursor-pointer w-5 h-5"
                                onClick={() => handleRemoveOption(optionIndex)}
                              />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            align="center"
                            className="bg-black ml-4 text-white text-sm rounded shadow-md"
                          >
                            Delete
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-2 ml-14">
              <Button type="button" className="bg-primary-700" onClick={handleAddOption}>
                Add Option
              </Button>
              <Button
                type="button"
                className="text-error-700 bg-color-white border border-neutral-300"
                onClick={handleRemoveQuestion}
              >
                Delete Question
              </Button>
            </div>
          </Accordion.Content>
        </div>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default AnswerSelectQuestion;
