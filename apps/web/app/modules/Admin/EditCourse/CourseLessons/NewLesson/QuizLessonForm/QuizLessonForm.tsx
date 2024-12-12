import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
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

import type { Question } from "./QuizLessonForm.types";
import type { QuizLessonFormValues } from "./validators/quizLessonFormChemat";
import type { UseFormReturn } from "react-hook-form";

const QuizLessonForm = () => {
  const { form } = useQuizLessonForm();

  const questions = form.watch("questions");

  const addQuestion = (questionType: string) => {
    const questions = form.getValues("questions") || [];

    // const lastQuestionOptions =
    //   questions.length > 0 && Array.isArray(questions[questions.length - 1].options)
    //     ? questions[questions.length - 1].options
    //     : [];

    // const newPosition = lastQuestionOptions
    //   ? Math.max(...lastQuestionOptions.map((option) => option.position)) + 1
    //   : 1;

    const newQuestion = {
      questionType,
      questionBody: "",
      state: "draft",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.setValue("questions", [...questions, newQuestion as any]);
  };

  const renderQuestion = (
    question: Question,
    questionIndex: number,
    form: UseFormReturn<QuizLessonFormValues>,
  ) => {
    switch (question.questionType) {
      case "single_choice":
      case "multiple_choice":
        return (
          <AnswerSelectQuestion key={questionIndex} questionIndex={questionIndex} form={form} />
        );
      case "true_or_false":
        return (
          <TrueOrFalseQuestion key={questionIndex} questionIndex={questionIndex} form={form} />
        );
      case "brief_response":
      case "detailed_response":
        return <OpenQuestion key={questionIndex} questionIndex={questionIndex} form={form} />;
      case "photo_question":
        return <PhotoQuestion key={questionIndex} questionIndex={questionIndex} form={form} />;
      case "fill_in_the_blanks":
        return (
          <FillInTheBlanksQuestion key={questionIndex} questionIndex={questionIndex} form={form} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-full">
      <div className="w-full max-w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-grey-500 mb-2">Quiz</h1>
        <Form {...form}>
          <form>
            <div className="flex items-center justify-end">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormControl className="flex items-center">
                      <Checkbox
                        id="state"
                        checked={field.value === "draft"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "draft" : "published")
                        }
                        className="mr-2 w-5 h-5 mb"
                      />
                    </FormControl>
                    <Label htmlFor="state" className="text-right text-l leading-[1] mt-[2px]">
                      Draft
                    </Label>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="title" className="text-right body-base-md">
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
                {questions.length})
              </Label>
            </div>

            {questions.map((question, questionIndex) =>
              renderQuestion(question, questionIndex, form),
            )}
            <QuestionSelector addQuestion={addQuestion} />

            <div className="flex space-x-4 mt-4">
              <Button type="submit" className="bg-[#3F58B6] hover:bg-blue-600 text-white">
                Save
              </Button>
              <Button className="bg-transparent text-red-500 border border-red-500 hover:bg-red-100">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default QuizLessonForm;
