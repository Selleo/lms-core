import * as Accordion from "@radix-ui/react-accordion";
import { useCallback, useEffect, useState } from "react";

import { useUploadFile } from "~/api/mutations/admin/useUploadFile";
import ImageUploadInput from "~/components/FileUploadInput/ImageUploadInput";
import { Icon } from "~/components/Icon";
import { SortableList } from "~/components/SortableList";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

import { QuestionType } from "../QuizLessonForm.types";

import type { QuestionOption } from "../QuizLessonForm.types";
import type { QuizLessonFormValues } from "../validators/quizLessonFormSchema";
import type { UseFormReturn } from "react-hook-form";
import { DeleteContentType, type Lesson } from "~/modules/Admin/EditCourse/EditCourse.types";
import DeleteConfirmationModal from "~/modules/Admin/components/DeleteConfirmationModal";
import { useTranslation } from "react-i18next";


type PhotoQuestionProps = {
  form: UseFormReturn<QuizLessonFormValues>;
  questionIndex: number;
  lessonToEdit: Lesson | null;
};

const PhotoQuestion = ({ form, questionIndex, lessonToEdit }: PhotoQuestionProps) => {
  const questionType = form.watch(`questions.${questionIndex}.type`);
  const [isUploading, setIsUploading] = useState(false);
  const { mutateAsync: uploadFile } = useUploadFile();
  const [displayImageUrl, setDisplayImageUrl] = useState<string | undefined>(undefined);
  const watchedOptions = form.watch(`questions.${questionIndex}.options`);
  const errors = form.formState.errors;
  const { t } = useTranslation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
        if (questionType === QuestionType.PHOTO_QUESTION_SINGLE_CHOICE) {
          updatedOptions.forEach((option, index) => {
            option.isCorrect = index === optionIndex;
          });
        } else if (questionType === QuestionType.PHOTO_QUESTION_MULTIPLE_CHOICE) {
          updatedOptions[optionIndex].isCorrect = value as boolean;
        }
      } else {
        updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], [field]: value as string };
      }

      form.setValue(`questions.${questionIndex}.options`, updatedOptions, { shouldDirty: true });
    },
    [form, questionIndex, questionType],
  );

  const handleImageUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const result = await uploadFile({ file, resource: "lesson" });
        setDisplayImageUrl(result.fileUrl);
        form.setValue(`questions.${questionIndex}.photoS3Key`, result.fileKey, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [form, uploadFile, questionIndex],
  );

  const onDeleteQuestion = () => {
    handleRemoveQuestion();
    setIsDeleteModalOpen(false);
  };

  return (
    <Accordion.Root key={questionIndex} type="single" collapsible>
      <Accordion.Item value={`item-${questionIndex}`}>
        <div className="p-2 mt-3 rounded-xl border-0 transition-all duration-300">
          <div className="ml-14">
            <FormField
              control={form.control}
              name={`questions.${questionIndex}.photoS3Key`}
              render={({ field }) => (
                <FormItem className="mt-5 w-1/3">
                  <Label htmlFor="imageUrl" className="body-base-md">
                    <span className="text-red-500 mr-1">*</span>
                    {t("adminCourseView.curriculum.lesson.field.options")}
                  </Label>
                  <FormControl>
                    <ImageUploadInput
                      field={field}
                      handleImageUpload={handleImageUpload}
                      isUploading={isUploading}
                      imageUrl={displayImageUrl}
                    />
                  </FormControl>
                  {isUploading && <p>{t('common.other.uploadingImage')}</p>}
                  {errors?.questions?.[questionIndex]?.photoS3Key && (
                    <p className="text-red-500 text-sm">
                      {errors?.questions?.[questionIndex]?.photoS3Key?.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`questions.${questionIndex}.type`}
              render={({ field }) => (
                <FormItem className="w-1/6 mt-4">
                  <Label htmlFor="type" className="body-base-md">
                    <span className="text-red-500 mr-1">*</span>
                    {t("adminCourseView.curriculum.lesson.field.type")}
                  </Label>
                  <FormControl>
                    <Select
                      {...field}
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={QuestionType.PHOTO_QUESTION_SINGLE_CHOICE}
                      value={field.value || QuestionType.PHOTO_QUESTION_SINGLE_CHOICE}
                    >
                      <SelectTrigger>
                        <SelectValue
                          className="text-left body-base-md"
                          placeholder={t("adminCourseView.curriculum.lesson.placeholder.singleChoice")}
                        />
                        <SelectValue
                          className="text-left body-base-md"
                          placeholder={t("adminCourseView.curriculum.lesson.placeholder.multipleChoice")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value={QuestionType.PHOTO_QUESTION_SINGLE_CHOICE}
                          className="text-left body-base-md"
                        >
                          {t("adminCourseView.curriculum.lesson.placeholder.singleChoice")}
                        </SelectItem>
                        <SelectItem
                          value={QuestionType.PHOTO_QUESTION_MULTIPLE_CHOICE}
                          className="text-left body-base-md"
                        >
                          {t("adminCourseView.curriculum.lesson.placeholder.multipleChoice")}
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
                <Label className="body-sm-md">{t("adminCourseView.curriculum.lesson.field.options")}</Label>
              </>
            )}
            {watchedOptions && watchedOptions?.length > 0 && (
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
                          name={`questions.${questionIndex}.options.${index}.optionText`}
                          type="text"
                          value={item.optionText}
                          onChange={(e) =>
                            handleOptionChange(index as number, "optionText", e.target.value)
                          }
                          placeholder={`${t("adminCourseView.curriculum.lesson.placeholder.option")} ${index + 1}`}
                          required
                          className="flex-1"
                        />
                        <div className="flex items-center">
                          {questionType === QuestionType.PHOTO_QUESTION_SINGLE_CHOICE ? (
                            <Input
                              type="radio"
                              className="w-4 h-4 cursor-pointer"
                              name={`questions.${questionIndex}.options.${index}.isCorrect`}
                              checked={item.isCorrect}
                              onChange={() =>
                                handleOptionChange(index, "isCorrect", !item.isCorrect)
                              }
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
                            {t("adminCourseView.curriculum.lesson.other.correct")}
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
                                {t("common.button.delete")}
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
          {errors?.questions?.[questionIndex] && (
            <p className="text-red-500 text-sm ml-14">
              {errors?.questions?.[questionIndex]?.options?.message}
            </p>
          )}
          <div className="mt-4 flex gap-2 mb-4 ml-14">
            <Button className="bg-primary-700" type="button" onClick={handleAddOption}>
              {t("adminCourseView.curriculum.lesson.button.addOption")}
            </Button>
            <Button
              type="button"
              className="text-error-700 bg-color-white border border-neutral-300"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              {t("adminCourseView.curriculum.lesson.button.deleteQuestion")}
            </Button>
          </div>
          <DeleteConfirmationModal
            open={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onDelete={onDeleteQuestion}
            contentType={DeleteContentType.QUESTION}
          />
        </div>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default PhotoQuestion;
