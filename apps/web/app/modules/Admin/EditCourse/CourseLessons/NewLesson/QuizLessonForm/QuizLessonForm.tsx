import { Button } from "~/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import AnswerSelectQuestion from "./components/AnswerSelectQuestion";
import FillInTheBlanksQuestion from "./components/FillInTheBlanksQuestion";
import OpenQuestion from "./components/OpenQuestion";
import PhotoQuestion from "./components/PhotoQuestion";
import QuestionSelector from "./components/QuestionSelector";
import TrueOrFalseQuestion from "./components/TrueOrFalseQuestion";
import { useQuizLessonForm } from "./hooks/useQuizLessonForm";

import { Question, QuestionType } from "./QuizLessonForm.types";
import type { QuizLessonFormValues } from "./validators/quizLessonFormSchema";
import type { UseFormReturn } from "react-hook-form";
import { Chapter, ContentTypes, Lesson } from "../../../EditCourse.types";
import { useCallback } from "react";

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
  const { form, onSubmit, onClickDelete } = useQuizLessonForm({
    setContentTypeToDisplay,
    chapterToEdit,
    lessonToEdit,
  });

  const questions = form.watch("questions");

  const addQuestion = useCallback(
    (questionType: string) => {
      const questions = form.getValues("questions") || [];

      const newQuestion: Question = {
        title: "",
        type: questionType as QuestionType,
        photoQuestionType:
          questionType === QuestionType.PHOTO_QUESTION ? QuestionType.SINGLE_CHOICE : undefined,
      };

      form.setValue("questions", [...questions, newQuestion]);
    },
    [form],
  );

  const renderQuestion = useCallback(
    (question: Question, questionIndex: number, form: UseFormReturn<QuizLessonFormValues>) => {
      switch (question.type) {
        case QuestionType.SINGLE_CHOICE:
        case QuestionType.MULTIPLE_CHOICE:
          return (
            <AnswerSelectQuestion key={questionIndex} questionIndex={questionIndex} form={form} />
          );
        case QuestionType.TRUE_OR_FALSE:
          return (
            <TrueOrFalseQuestion key={questionIndex} questionIndex={questionIndex} form={form} />
          );
        case QuestionType.BRIEF_RESPONSE:
        case QuestionType.DETAILED_RESPONSE:
          return <OpenQuestion key={questionIndex} questionIndex={questionIndex} form={form} />;
        case QuestionType.PHOTO_QUESTION:
          return (
            <PhotoQuestion
              key={questionIndex}
              questionIndex={questionIndex}
              form={form}
              lessonToEdit={lessonToEdit}
            />
          );
        case QuestionType.FILL_IN_THE_BLANKS:
          return (
            <FillInTheBlanksQuestion
              key={questionIndex}
              questionIndex={questionIndex}
              form={form}
            />
          );
        default:
          return null;
      }
    },
    [],
  );

  return (
    <div className="w-full max-w-full">
      <div className="w-full max-w-full bg-white shadow-lg rounded-lg p-6">
        {lessonToEdit && <h5 className="text-neutral-900 mb-2">Edit: {lessonToEdit.title}</h5>}
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
                <span className="text-red-500 mr-1 body-base-md">*</span> Questions (
                {questions?.length || 0})
              </Label>
            </div>

            {questions?.map((question, questionIndex) =>
              renderQuestion(question, questionIndex, form),
            )}
            <QuestionSelector addQuestion={addQuestion} />

            <div className="flex space-x-4 mt-4">
              <Button type="submit" className="bg-primary-700">
                Save
              </Button>
              {lessonToEdit ? (
                <Button
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
    </div>
  );
};

export default QuizLessonForm;
