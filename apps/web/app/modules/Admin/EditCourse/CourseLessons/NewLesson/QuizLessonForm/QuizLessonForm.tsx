import { useCallback, useEffect, useState } from "react";
import { match } from "ts-pattern";

import { Icon } from "~/components/Icon";
import { SortableList } from "~/components/SortableList";
import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useLeaveModal } from "~/context/LeaveModalContext";
import DeleteConfirmationModal from "~/modules/Admin/components/DeleteConfirmationModal";
import LeaveConfirmationModal from "~/modules/Admin/components/LeaveConfirmationModal";
import { QuestionType } from "~/modules/Admin/EditCourse/CourseLessons/NewLesson/QuizLessonForm/QuizLessonForm.types";

import { ContentTypes, DeleteContentType } from "../../../EditCourse.types";
import Breadcrumb from "../components/Breadcrumb";

import AnswerSelectQuestion from "./components/AnswerSelectQuestion";
import FillInTheBlanksQuestion from "./components/FillInTheBlanksQuestion";
import MatchWordsQuestion from "./components/MatchWordsQuestion";
import PhotoQuestion from "./components/PhotoQuestion";
import QuestionSelector from "./components/QuestionSelector";
import QuestionWrapper from "./components/QuestionWrapper";
import ScaleQuestion from "./components/ScaleQuestion";
import TrueOrFalseQuestion from "./components/TrueOrFalseQuestion";
import { useQuizLessonForm } from "./hooks/useQuizLessonForm";

import type { Question, QuestionOption } from "./QuizLessonForm.types";
import type { QuizLessonFormValues } from "./validators/quizLessonFormSchema";
import type { Chapter, Lesson } from "../../../EditCourse.types";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

type QuizLessonProps = {
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
  chapterToEdit: Chapter | null;
  lessonToEdit: Lesson | null;
  setSelectedLesson: (lesson: Lesson | null) => void;
};

const QuizLessonForm = ({
  setContentTypeToDisplay,
  chapterToEdit,
  lessonToEdit,
  setSelectedLesson,
}: QuizLessonProps) => {
  const { form, onSubmit, onDelete } = useQuizLessonForm({
    setContentTypeToDisplay,
    chapterToEdit,
    lessonToEdit,
  });

  const questions = form.watch("questions");
  const { t } = useTranslation();
  const { isDirty } = form.formState;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [openQuestionIndexes, setOpenQuestionIndexes] = useState<Set<number>>(new Set());
  const {
    isLeaveModalOpen,
    closeLeaveModal,
    setIsCurrectFormDirty,
    isCurrentFormDirty,
    openLeaveModal,
    setIsLeavingContent,
  } = useLeaveModal();
  const [isCanceling, setIsCanceling] = useState(false);

  const onCloseModal = () => {
    setIsDeleteModalOpen(false);
  };

  const onClickDelete = () => {
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    setIsCurrectFormDirty(isDirty);
  }, [isDirty]);

  const onCancelModal = () => {
    closeLeaveModal();
    setIsCurrectFormDirty(false);
  };

  const onSaveModal = () => {
    form.handleSubmit(onSubmit)();
    closeLeaveModal();
  };

  const onCancel = useCallback(() => {
    if (isCurrentFormDirty) {
      setIsCanceling(true);
      setIsLeavingContent(true);
      openLeaveModal();
      return;
    }
    setContentTypeToDisplay(ContentTypes.EMPTY);
  }, [
    isCurrentFormDirty,
    setIsCanceling,
    setIsLeavingContent,
    openLeaveModal,
    setContentTypeToDisplay,
  ]);

  useEffect(() => {
    if (!isCurrentFormDirty && isCanceling) {
      onCancel();
      setIsCanceling(false);
      setIsLeavingContent(false);
    }
  }, [isCurrentFormDirty, isCanceling, onCancel]);

  const addQuestion = useCallback(
    (questionType: QuestionType) => {
      const questions = form.getValues("questions") || [];

      const getOptionsForQuestionType = (type: QuestionType): QuestionOption[] => {
        const singleChoiceTypes = [
          QuestionType.SINGLE_CHOICE,
          QuestionType.MULTIPLE_CHOICE,
          QuestionType.MATCH_WORDS,
          QuestionType.PHOTO_QUESTION_SINGLE_CHOICE,
          QuestionType.PHOTO_QUESTION_MULTIPLE_CHOICE,
        ];

        const noOptionsRequiredTypes = [
          QuestionType.FILL_IN_THE_BLANKS_TEXT,
          QuestionType.FILL_IN_THE_BLANKS_DND,
          QuestionType.BRIEF_RESPONSE,
          QuestionType.DETAILED_RESPONSE,
        ];

        if (singleChoiceTypes.includes(type)) {
          return [
            { optionText: "", isCorrect: false, displayOrder: 1 },
            { optionText: "", isCorrect: false, displayOrder: 2 },
          ];
        }

        if (!noOptionsRequiredTypes.includes(type)) {
          return [{ optionText: "", isCorrect: false, displayOrder: 1 }];
        }

        return [];
      };

      const options = getOptionsForQuestionType(questionType);

      const newQuestion: Question = {
        title: "",
        type: questionType as QuestionType,
        displayOrder: questions.length + 1,
        options: options,
      };

      form.setValue("questions", [...questions, newQuestion], { shouldDirty: true });

      setOpenQuestionIndexes((prev) => new Set(prev).add(questions.length));
    },
    [form],
  );

  const handleToggleQuestion = (questionIndex: number) => {
    setOpenQuestionIndexes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  };

  const renderQuestion = useCallback(
    (
      question: Question,
      questionIndex: number,
      form: UseFormReturn<QuizLessonFormValues>,
      dragTrigger: React.ReactNode,
    ) => {
      return (
        <QuestionWrapper
          key={questionIndex}
          questionType={question.type}
          questionIndex={questionIndex}
          form={form}
          dragTrigger={dragTrigger}
          item={question}
          isOpen={openQuestionIndexes.has(questionIndex)}
          handleToggle={() => handleToggleQuestion(questionIndex)}
        >
          {match(question.type)
            .with(QuestionType.SINGLE_CHOICE, QuestionType.MULTIPLE_CHOICE, () => (
              <AnswerSelectQuestion questionIndex={questionIndex} form={form} />
            ))
            .with(QuestionType.TRUE_OR_FALSE, () => (
              <TrueOrFalseQuestion questionIndex={questionIndex} form={form} />
            ))
            .with(
              QuestionType.PHOTO_QUESTION_SINGLE_CHOICE,
              QuestionType.PHOTO_QUESTION_MULTIPLE_CHOICE,
              () => (
                <PhotoQuestion
                  questionIndex={questionIndex}
                  form={form}
                  lessonToEdit={lessonToEdit}
                />
              ),
            )
            .with(QuestionType.MATCH_WORDS, () => (
              <MatchWordsQuestion questionIndex={questionIndex} form={form} />
            ))
            .with(QuestionType.FILL_IN_THE_BLANKS_TEXT, QuestionType.FILL_IN_THE_BLANKS_DND, () => (
              <FillInTheBlanksQuestion questionIndex={questionIndex} form={form} />
            ))
            .with(QuestionType.SCALE_1_5, () => (
              <ScaleQuestion questionIndex={questionIndex} form={form} />
            ))
            .otherwise(() => null)}
        </QuestionWrapper>
      );
    },
    [lessonToEdit, openQuestionIndexes],
  );

  return (
    <div className="w-full max-w-full">
      <div className="w-full max-w-full bg-white shadow-lg rounded-lg p-8">
        <Breadcrumb
          lessonLabel="Quiz"
          setContentTypeToDisplay={setContentTypeToDisplay}
          setSelectedLesson={setSelectedLesson}
        />
        <div className="h5 text-neutral-950 mb-6">
          {lessonToEdit ? (
            <>
              <span className="text-neutral-600">
                {t("adminCourseView.curriculum.other.edit")}{" "}
              </span>
              <span className="font-bold">{lessonToEdit.title}</span>
            </>
          ) : (
            t("adminCourseView.curriculum.other.create")
          )}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="title" className="body-base-md">
                    <span className="text-red-500 mr-1">*</span>
                    {t("adminCourseView.curriculum.lesson.field.title")}
                  </Label>
                  <FormControl>
                    <Input id="title" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-5">
              <Label className="body-base-md">
                <span className="text-red-500 mr-1 body-base-md">*</span>{" "}
                {t("adminCourseView.curriculum.lesson.field.questions")}
                <span className="text-neutral-600"> ({questions?.length || 0})</span>
              </Label>
            </div>

            {questions && questions.length > 0 && (
              <SortableList
                items={questions}
                isQuiz
                onChange={(updatedItems) => {
                  form.setValue(`questions`, updatedItems, { shouldDirty: true });
                }}
                className="grid grid-cols-1"
                renderItem={(item, index: number) => (
                  <SortableList.Item id={item.displayOrder}>
                    {renderQuestion(
                      item,
                      index,
                      form,
                      <SortableList.DragHandle>
                        <Icon name="DragAndDropIcon" className="cursor-move" />
                      </SortableList.DragHandle>,
                    )}
                  </SortableList.Item>
                )}
              />
            )}

            <QuestionSelector addQuestion={addQuestion} />
            <div className="flex space-x-4 mt-4">
              <Button type="submit" className="bg-primary-700">
                {t("common.button.save")}
              </Button>
              {lessonToEdit ? (
                <Button
                  type="button"
                  onClick={onClickDelete}
                  className="text-error-700 bg-color-white border border-neutral-300"
                >
                  {t("common.button.delete")}
                </Button>
              ) : (
                <Button
                  className="text-error-700 bg-color-white border border-neutral-300"
                  type="button"
                  onClick={onCancel}
                >
                  {t("common.button.cancel")}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={onCloseModal}
        onDelete={onDelete}
        contentType={DeleteContentType.QUIZ}
      />
      <LeaveConfirmationModal
        open={isLeaveModalOpen || false}
        onClose={onCancelModal}
        onSave={onSaveModal}
      />
    </div>
  );
};

export default QuizLessonForm;
