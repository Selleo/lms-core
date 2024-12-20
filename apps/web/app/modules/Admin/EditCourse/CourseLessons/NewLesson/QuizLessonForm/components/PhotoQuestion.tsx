import * as Accordion from "@radix-ui/react-accordion";
import { useCallback, useEffect, useState } from "react";

import { useUploadFile } from "~/api/mutations/admin/useUploadFile";
import ImageUploadInput from "~/components/FileUploadInput/ImageUploadInput";
import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import type { QuizLessonFormValues } from "../validators/quizLessonFormSchema";
import type { UseFormReturn } from "react-hook-form";
import { QuestionOption, QuestionType } from "../QuizLessonForm.types";
import { cn } from "~/lib/utils";
import { Lesson } from "~/modules/Admin/EditCourse/EditCourse.types";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "~/components/ui/tooltip";
import { Checkbox } from "~/components/ui/checkbox";
import { SortableList } from "~/components/SortableList";

type PhotoQuestionProps = {
  form: UseFormReturn<QuizLessonFormValues>;
  questionIndex: number;
  lessonToEdit?: Lesson;
};

const PhotoQuestion = ({ form, questionIndex, lessonToEdit }: PhotoQuestionProps) => {
  const photoQuestionType = form.watch(`questions.${questionIndex}.photoQuestionType`);
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: uploadFile } = useUploadFile();
  const [displayImageUrl, setDisplayImageUrl] = useState<string | undefined>(undefined);
  const watchedOptions = form.watch(`questions.${questionIndex}.options`);

  useEffect(() => {
    setDisplayImageUrl(lessonToEdit?.questions?.[questionIndex]?.photoS3SingedUrl);
  }, [lessonToEdit]);

  const isOptionEmpty =
    !Array.isArray(form.getValues(`questions.${questionIndex}.options`)) ||
    form.getValues(`questions.${questionIndex}.options`)?.length === 0;

  const handleAddOption = useCallback(() => {
    const currentOptions: QuestionOption[] =
      form.getValues(`questions.${questionIndex}.options`) || [];
    const newOption: QuestionOption = {
      optionText: "",
      isCorrect: false,
      displayOrder: currentOptions.length + 1,
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
        if (photoQuestionType === QuestionType.SINGLE_CHOICE) {
          updatedOptions.forEach((option, index) => {
            option.isCorrect = index === optionIndex;
          });
        } else if (photoQuestionType === QuestionType.MULTIPLE_CHOICE) {
          updatedOptions[optionIndex].isCorrect = value as boolean;
        }
      } else {
        updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], [field]: value as string };
      }

      form.setValue(`questions.${questionIndex}.options`, updatedOptions);
    },
    [form, questionIndex, photoQuestionType],
  );

  const handleImageUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const result = await uploadFile({ file, resource: "lesson" });
        setDisplayImageUrl(result.fileUrl);
        form.setValue(`questions.${questionIndex}.photoS3Key`, result.fileKey, {
          shouldValidate: true,
        });
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [form, uploadFile, questionIndex],
  );

  return (
    <Accordion.Root key={questionIndex} type="single" collapsible>
      <Accordion.Item value={`item-${questionIndex}`}>
        <div className={"p-2 mt-3 rounded-xl border-0 transition-all duration-300"}>
          <div className="ml-14">
            <FormField
              control={form.control}
              name={`questions.${questionIndex}.photoS3Key`}
              render={({ field }) => (
                <FormItem className="mt-5 w-1/3">
                  <Label htmlFor="imageUrl" className="body-base-md ">
                    <span className="text-red-500 mr-1">*</span>
                    Image
                  </Label>
                  <FormControl>
                    <ImageUploadInput
                      field={field}
                      handleImageUpload={handleImageUpload}
                      isUploading={isUploading}
                      imageUrl={displayImageUrl}
                    />
                  </FormControl>

                  {isUploading && <p>Uploading image...</p>}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`questions.${questionIndex}.photoQuestionType`}
              render={({ field }) => (
                <FormItem className="w-1/6 mt-4">
                  <Label htmlFor="type" className="body-base-md">
                    <span className="text-red-500 mr-1">*</span>
                    Type
                  </Label>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={QuestionType.SINGLE_CHOICE}
                      value={field.value || QuestionType.SINGLE_CHOICE}
                    >
                      <SelectTrigger>
                        <SelectValue
                          className="text-left body-base-md"
                          placeholder="Single select"
                        />
                        <SelectValue
                          className="text-left body-base-md"
                          placeholder="Multi select"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value={QuestionType.SINGLE_CHOICE}
                          className="text-left body-base-md"
                        >
                          Single select
                        </SelectItem>
                        <SelectItem
                          value={QuestionType.MULTIPLE_CHOICE}
                          className="text-left body-base-md"
                        >
                          Multi select
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="ml-14 mt-4">
            {!isOptionEmpty && (
              <>
                <span className="text-red-500 mr-1">*</span>
                <Label className="body-sm-md">Options</Label>
              </>
            )}
            {watchedOptions && watchedOptions?.length > 0 && (
              <SortableList
                items={watchedOptions as any[]}
                isQuiz
                onChange={(updatedItems) => {
                  form.setValue(`questions.${questionIndex}.options`, updatedItems);
                }}
                className="grid grid-cols-1"
                renderItem={(item, index: number) => (
                  <SortableList.Item id={item.displayOrder}>
                    <div className="mt-4">
                      <div className="border border-gray-300 p-4 rounded-xl flex items-center space-x-2">
                        <SortableList.DragHandle>
                          <Icon name="DragAndDropIcon" className="cursor-move" />
                        </SortableList.DragHandle>
                        <Input
                          type="text"
                          value={item.optionText}
                          onChange={(e) =>
                            handleOptionChange(index as number, "optionText", e.target.value)
                          }
                          placeholder={`Option ${index + 1}`}
                          required
                          className="flex-1"
                        />
                        <div className="flex items-center">
                          {photoQuestionType === QuestionType.SINGLE_CHOICE ? (
                            <Input
                              type="radio"
                              className="w-4 h-4 cursor-pointer ml-3"
                              name={`questions.${questionIndex}.correctOption`}
                              checked={item.isCorrect}
                              onChange={() =>
                                handleOptionChange(index, "isCorrect", !item.isCorrect)
                              }
                            />
                          ) : (
                            <div className="cursor-pointer ml-3">
                              <Checkbox
                                id="isCorrect"
                                className="w-5 h-5 mt-1"
                                checked={item.isCorrect}
                                isSquareCheck
                                onCheckedChange={() =>
                                  handleOptionChange(index, "isCorrect", !item.isCorrect)
                                }
                              />
                            </div>
                          )}
                          <Label className="ml-2 body-sm text-neutral-950">Correct</Label>
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
          <div className="mt-4 flex gap-2 mb-4 ml-14">
            <Button className="bg-primary-700" type="button" onClick={handleAddOption}>
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

export default PhotoQuestion;
