import * as Accordion from "@radix-ui/react-accordion";
import { useCallback, useMemo, useEffect, useState } from "react";

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

import QuestionTitle from "./QuestionTitle";

import type { QuizLessonFormValues } from "../validators/quizLessonFormSchema";
import type { UseFormReturn } from "react-hook-form";
import { QuestionOption, QuestionType } from "../QuizLessonForm.types";
import { cn } from "~/lib/utils";
import { Lesson } from "~/modules/Admin/EditCourse/EditCourse.types";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "~/components/ui/tooltip";

type PhotoQuestionProps = {
  form: UseFormReturn<QuizLessonFormValues>;
  questionIndex: number;
  lessonToEdit?: Lesson;
};

const PhotoQuestion = ({ form, questionIndex, lessonToEdit }: PhotoQuestionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const questionType = form.getValues(`questions.${questionIndex}.type`);

  const photoQuestionType = form.watch(`questions.${questionIndex}.photoQuestionType`);
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: uploadFile } = useUploadFile();
  const [displayImageUrl, setDisplayImageUrl] = useState<string | undefined>(undefined);

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

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

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
          <Accordion.Content className="mt-8">
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
                      {photoQuestionType === QuestionType.SINGLE_CHOICE ? (
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
                        className="ml-2 text-neutral-900 body-base cursor-pointer"
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
          </Accordion.Content>
        </div>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default PhotoQuestion;
