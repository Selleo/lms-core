import * as Accordion from "@radix-ui/react-accordion";
import { useCallback, useState } from "react";

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

import type { QuizLessonFormValues } from "../validators/quizLessonFormChemat";
import type { UseFormReturn } from "react-hook-form";

type PhotoQuestionProps = {
  form: UseFormReturn<QuizLessonFormValues>;
  questionIndex: number;
};

type Option = {
  value: string;
  isCorrect: boolean;
  position: number;
};

const PhotoQuestion = ({ form, questionIndex }: PhotoQuestionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const questionType = form.getValues(`questions.${questionIndex}.questionType`);

  const photoQuestionType = form.getValues(`questions.${questionIndex}.photoQuestionType`);
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: uploadFile } = useUploadFile();
  const imageUrl = form.getValues(`questions.${questionIndex}.imageUrl`);

  const isOptionEmpty =
    !Array.isArray(form.getValues(`questions.${questionIndex}.options`)) ||
    form.getValues(`questions.${questionIndex}.options`)?.length === 0;

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
      if (photoQuestionType === "single_choice") {
        updatedOptions.forEach((option, index) => {
          option.isCorrect = index === optionIndex;
        });
      } else if (photoQuestionType === "multiple_choice") {
        updatedOptions[optionIndex].isCorrect = value;
      }
    } else {
      updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], [field]: value };
    }

    form.setValue(`questions.${questionIndex}.options`, updatedOptions);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleImageUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const result = await uploadFile({ file, resource: "lesson" });
        form.setValue(`questions.${questionIndex}.imageUrl`, result.fileUrl, {
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
    <Accordion.Root
      key={questionIndex}
      type="single"
      collapsible
      defaultValue={`item-${questionIndex}`}
    >
      <Accordion.Item value={`item-${questionIndex}`}>
        <div
          className={`border p-4 mt-4 rounded-xl transition-all duration-300 ${
            isOpen ? "border-gray-200" : "border-blue-500"
          }`}
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
              <FormField
                control={form.control}
                name={`questions.${questionIndex}.imageUrl`}
                render={({ field }) => (
                  <FormItem className="mt-5 w-1/3">
                    <Label htmlFor="imageUrl" className="text-right">
                      <span className="text-red-500 mr-1">*</span>
                      Image
                    </Label>
                    <FormControl>
                      <ImageUploadInput
                        field={field}
                        handleImageUpload={handleImageUpload}
                        isUploading={isUploading}
                        imageUrl={imageUrl}
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
                  <FormItem className="w-1/6">
                    <Label htmlFor="type" className="text-right body-base mt-4">
                      Type
                    </Label>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value || "single_choice"}
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
                          <SelectItem value="single_choice" className="text-left body-base-md">
                            Single select
                          </SelectItem>
                          <SelectItem value="multiple_choice" className="text-left body-base-md">
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
                      value={option.value}
                      onChange={(e) => handleOptionChange(optionIndex, "value", e.target.value)}
                      placeholder={`Option ${optionIndex + 1}`}
                      required
                      className="flex-1"
                    />
                    <div className="flex items-center">
                      {photoQuestionType === "single_choice" ? (
                        <input
                          type="radio"
                          name={`questions.${questionIndex}.correctOption`}
                          checked={option.isCorrect}
                          onChange={() =>
                            handleOptionChange(optionIndex, "isCorrect", !option.isCorrect)
                          }
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={() =>
                            handleOptionChange(optionIndex, "isCorrect", !option.isCorrect)
                          }
                        />
                      )}
                      <Label className="ml-2 text-neutral-900 body-base">Correct</Label>
                      <Icon
                        name="TrashIcon"
                        className="text-red-500 ml-2 cursor-pointer w-5 h-5"
                        onClick={() => handleRemoveOption(optionIndex)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
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
          </Accordion.Content>
        </div>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default PhotoQuestion;
