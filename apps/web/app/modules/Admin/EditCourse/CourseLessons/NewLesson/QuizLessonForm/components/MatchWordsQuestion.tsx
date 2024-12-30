import { useCallback } from "react";
import { QuizLessonFormValues } from "../validators/quizLessonFormSchema";
import { QuestionOption } from "../QuizLessonForm.types";
import { UseFormReturn } from "react-hook-form";
import * as Accordion from "@radix-ui/react-accordion";
import { Label } from "~/components/ui/label";
import { SortableList } from "~/components/SortableList";
import { Icon } from "~/components/Icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

type MatchWordsQuestionProps = {
  form: UseFormReturn<QuizLessonFormValues>;
  questionIndex: number;
};

const MatchWordsQuestion = ({ form, questionIndex }: MatchWordsQuestionProps) => {
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
    (optionIndex: number, field: "optionText" | "matchedWord", value: string) => {
      const currentOptions: QuestionOption[] =
        form.getValues(`questions.${questionIndex}.options`) || [];
      const updatedOptions = [...currentOptions];

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
                        <div className="flex gap-2 w-full">
                          <Input
                            type="text"
                            name={`questions.${questionIndex}.options.${index}.optionText`}
                            value={item.optionText}
                            onChange={(e) =>
                              handleOptionChange(index, "optionText", e.target.value)
                            }
                            placeholder={`Option`}
                            required
                            className="w-[50%]"
                          />
                          <Input
                            type="text"
                            name={`questions.${questionIndex}.options.${index}.matchedWord`}
                            value={item.matchedWord}
                            onChange={(e) =>
                              handleOptionChange(index, "matchedWord", e.target.value)
                            }
                            placeholder={`Matched word`}
                            required
                            className="w-[50%]"
                          />
                        </div>
                        <div className="flex items-center">
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

export default MatchWordsQuestion;
