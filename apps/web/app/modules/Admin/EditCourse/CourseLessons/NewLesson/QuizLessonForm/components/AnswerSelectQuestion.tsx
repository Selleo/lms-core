import * as Accordion from "@radix-ui/react-accordion";
import { useCallback } from "react";
import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { QuizLessonFormValues } from "../validators/quizLessonFormSchema";
import type { UseFormReturn } from "react-hook-form";
import { QuestionOption, QuestionType } from "../QuizLessonForm.types";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "~/components/ui/tooltip";
import { Checkbox } from "~/components/ui/checkbox";
import { SortableList } from "~/components/SortableList";
import { Label } from "~/components/ui/label";

type AnswerSelectQuestionProps = {
  form: UseFormReturn<QuizLessonFormValues>;
  questionIndex: number;
};

const AnswerSelectQuestion = ({ form, questionIndex }: AnswerSelectQuestionProps) => {
  const questionType = form.getValues(`questions.${questionIndex}.type`);
  const watchedOptions = form.watch(`questions.${questionIndex}.options`);

  const handleAddOption = useCallback(() => {
    const currentOptions: QuestionOption[] =
      form.getValues(`questions.${questionIndex}.options`) || [];
    const newOption: QuestionOption = {
      optionText: "",
      isCorrect: false,
      displayOrder: currentOptions.length + 1,
    };
    form.setValue(`questions.${questionIndex}.options`, [...currentOptions, newOption], {
      shouldDirty: true,
    });
  }, [form, questionIndex]);

  const handleRemoveOption = useCallback(
    (optionIndex: number) => {
      const currentOptions: QuestionOption[] =
        form.getValues(`questions.${questionIndex}.options`) || [];
      const updatedOptions = currentOptions.filter((_, index) => index !== optionIndex);
      form.setValue(`questions.${questionIndex}.options`, updatedOptions, { shouldDirty: true });
    },
    [form, questionIndex],
  );

  const handleRemoveQuestion = useCallback(() => {
    const currentQuestions = form.getValues("questions") || [];
    const updatedQuestions = currentQuestions.filter((_, index) => index !== questionIndex);
    form.setValue("questions", updatedQuestions, { shouldDirty: true });
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
      form.setValue(`questions.${questionIndex}.options`, updatedOptions, { shouldDirty: true });
    },
    [form, questionIndex, questionType],
  );

  const isOptionEmpty =
    !Array.isArray(form.getValues(`questions.${questionIndex}.options`)) ||
    form.getValues(`questions.${questionIndex}.options`)?.length === 0;

  return (
    <Accordion.Root key={questionIndex} type="single" collapsible>
      <Accordion.Item value={`item-${questionIndex}`}>
        <div className="p-2 mt-3 rounded-xl border-0 transition-all duration-300">
          <div className="ml-14">
            {!isOptionEmpty ? (
              <>
                <span className="text-red-500 mr-1">*</span>
                <Label className="body-sm-md">Options</Label>
              </>
            ) : null}
            {watchedOptions && watchedOptions.length > 0 && (
              <SortableList
                items={watchedOptions}
                isQuiz
                onChange={(updatedItems) => {
                  form.setValue(`questions.${questionIndex}.options`, updatedItems, {
                    shouldDirty: true,
                  });
                }}
                className="grid grid-cols-1"
                renderItem={(item, index: number) => (
                  <SortableList.Item id={item.displayOrder}>
                    <div className="mt-2">
                      <div className="border border-neutral-200 p-2 pr-3 rounded-xl flex items-center space-x-2">
                        <SortableList.DragHandle>
                          <Icon name="DragAndDropIcon" className="cursor-move ml-4 mr-3" />
                        </SortableList.DragHandle>
                        <Input
                          type="text"
                          name={`questions.${questionIndex}.options.${index}.optionText`}
                          value={item.optionText}
                          onChange={(e) => handleOptionChange(index, "optionText", e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          required
                          className="flex-1"
                        />
                        <div className="flex items-center">
                          {questionType === QuestionType.SINGLE_CHOICE ? (
                            <Input
                              type="radio"
                              name={`questions.${questionIndex}.options.${index}.isCorrect`}
                              checked={item.isCorrect === true}
                              onChange={() => handleOptionChange(index, "isCorrect", true)}
                              className="w-4 h-4 cursor-pointer"
                            />
                          ) : (
                            <div className="cursor-pointer">
                              <Checkbox
                                id="isCorrect"
                                name={`questions.${questionIndex}.options.${index}.isCorrect`}
                                className="w-4 h-4 mt-1"
                                checked={item.isCorrect}
                                isSquareCheck
                                onCheckedChange={() =>
                                  handleOptionChange(index, "isCorrect", !item.isCorrect)
                                }
                              />
                            </div>
                          )}
                          <Label
                            onClick={() => handleOptionChange(index, "isCorrect", !item.isCorrect)}
                            className="ml-2 body-sm text-neutral-950 cursor-pointer"
                          >
                            Correct
                          </Label>
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="group">
                                  <Icon
                                    name="TrashIcon"
                                    className="text-error-500 bg-error-50 ml-3 cursor-pointer w-7 h-7 group-hover:text-white group-hover:bg-error-600 rounded-lg p-1"
                                    onClick={() => handleRemoveOption(index)}
                                  />
                                </div>
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
                  </SortableList.Item>
                )}
              />
            )}
          </div>

          <div className="mt-4 ml-14 flex gap-2">
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
        </div>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default AnswerSelectQuestion;
