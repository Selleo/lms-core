import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import AnswerSelectQuestion from "./components/AnswerSelectQuestion";
import FillInTheBlanksQuestion from "./components/FillInTheBlanksQuestion";
import PhotoQuestion from "./components/PhotoQuestion";
import QuestionSelector from "./components/QuestionSelector";
import TrueOrFalseQuestion from "./components/TrueOrFalseQuestion";
import { useQuizLessonForm } from "./hooks/useQuizLessonForm";
import { Question, QuestionType } from "./QuizLessonForm.types";
import type { UseFormReturn } from "react-hook-form";
import { Chapter, ContentTypes, DeleteContentType, Lesson } from "../../../EditCourse.types";
import { useCallback, useState } from "react";
import DeleteConfirmationModal from "~/modules/Admin/components/DeleteConfirmationModal";
import Breadcrumb from "../components/Breadcrumb";
import { SortableList } from "~/components/SortableList";
import { Icon } from "~/components/Icon";
import QuestionWrapper from "./components/QuestionWrapper";
import { QuizLessonFormValues } from "./validators/quizLessonFormSchema";

type QuizLessonProps = {
  setContentTypeToDisplay: (contentTypeToDisplay: string) => void;
  chapterToEdit?: Chapter;
  lessonToEdit?: Lesson;
};

const QuizLessonForm = ({
  setContentTypeToDisplay,
  chapterToEdit,
  lessonToEdit,
}: QuizLessonProps) => {
  const { form, onSubmit, onDelete } = useQuizLessonForm({
    setContentTypeToDisplay,
    chapterToEdit,
    lessonToEdit,
  });

  const questions = form.watch("questions");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  const onClickDelete = () => {
    setIsModalOpen(true);
  };

  const addQuestion = useCallback(
    (questionType: string) => {
      const questions = form.getValues("questions") || [];

      const newQuestion: Question = {
        title: "",
        type: questionType as QuestionType,
        displayOrder: questions.length + 1,
        photoQuestionType:
          questionType === QuestionType.PHOTO_QUESTION ? QuestionType.SINGLE_CHOICE : undefined,
      };

      form.setValue("questions", [...questions, newQuestion]);
    },
    [form],
  );

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
        >
          {question.type === QuestionType.SINGLE_CHOICE ||
          question.type === QuestionType.MULTIPLE_CHOICE ? (
            <AnswerSelectQuestion questionIndex={questionIndex} form={form} />
          ) : question.type === QuestionType.TRUE_OR_FALSE ? (
            <TrueOrFalseQuestion questionIndex={questionIndex} form={form} />
          ) : question.type === QuestionType.PHOTO_QUESTION ? (
            <PhotoQuestion questionIndex={questionIndex} form={form} lessonToEdit={lessonToEdit} />
          ) : question.type === QuestionType.FILL_IN_THE_BLANKS_TEXT ||
            question.type === QuestionType.FILL_IN_THE_BLANKS_DND ? (
            <FillInTheBlanksQuestion questionIndex={questionIndex} form={form} />
          ) : null}
        </QuestionWrapper>
      );
    },
    [lessonToEdit],
  );

  return (
    <div className="w-full max-w-full">
      <div className="w-full max-w-full bg-white shadow-lg rounded-lg p-8">
        <Breadcrumb lessonLabel="Quiz" setContentTypeToDisplay={setContentTypeToDisplay} />
        <div className="h5 text-neutral-950 mb-6">
          {lessonToEdit ? (
            <>
              <span className="text-neutral-600">Edit: </span>
              <span className="font-bold">{lessonToEdit.title}</span>
            </>
          ) : (
            "Create"
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
                    Title
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
                <span className="text-red-500 mr-1 body-base-md">*</span> Questions
                <span className="text-neutral-600"> ({questions?.length || 0})</span>
              </Label>
            </div>

            {questions && questions.length > 0 && (
              <SortableList
                items={questions}
                isQuiz
                onChange={(updatedItems) => {
                  form.setValue(`questions`, updatedItems);
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
                Save
              </Button>
              {lessonToEdit ? (
                <Button
                  type="button"
                  onClick={onClickDelete}
                  className="text-error-700 bg-color-white border border-neutral-300"
                >
                  Delete
                </Button>
              ) : (
                <Button
                  className="text-error-700 bg-color-white border border-neutral-300"
                  type="button"
                  onClick={() => setContentTypeToDisplay(ContentTypes.EMPTY)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
      <DeleteConfirmationModal
        open={isModalOpen}
        onClose={onCloseModal}
        onDelete={onDelete}
        contentType={DeleteContentType.QUIZ}
      />
    </div>
  );
};

export default QuizLessonForm;
