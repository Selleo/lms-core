import { Label } from "@radix-ui/react-label";

import { Icon } from "~/components/Icon";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import type { QuizLessonFormValues } from "../validators/quizLessonFormChemat";
import type { UseFormReturn } from "react-hook-form";

type SingleSelectQuizProps = {
  form: UseFormReturn<QuizLessonFormValues>;
};

type Option = {
  value: string;
  isCorrect: boolean;
  position: number;
};

const SingleSelectQuiz = ({ form }: SingleSelectQuizProps) => {
  const questions = form.watch("questions");

  const handleAddOption = (questionIndex: number) => {
    const currentOptions: Option[] = form.getValues(`questions.${questionIndex}.options`) || [];
    const newOption: Option = { value: "", isCorrect: false, position: currentOptions.length + 1 };

    form.setValue(`questions.${questionIndex}.options`, [...currentOptions, newOption]);
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    field: "value" | "isCorrect" | "position",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
  ) => {
    const currentOptions: Option[] = form.getValues(`questions.${questionIndex}.options`) || [];
    const updatedOptions = [...currentOptions];

    if (field === "isCorrect") {
      updatedOptions.forEach((option, index) => {
        if (index !== optionIndex) {
          option.isCorrect = false;
        }
      });
    }

    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      [field]: value,
    };

    form.setValue(`questions.${questionIndex}.options`, updatedOptions);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions: Option[] = form.getValues(`questions.${questionIndex}.options`) || [];
    const updatedOptions = currentOptions.filter((_, index) => index !== optionIndex);

    form.setValue(`questions.${questionIndex}.options`, updatedOptions);
  };

  return (
    <div className="w-full max-w-full mt-2">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => console.log(data))}>
            {questions.map((_, questionIndex) => (
              <div key={questionIndex}>
                <FormField
                  control={form.control}
                  name={`questions.${questionIndex}.questionBody`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor={`questionBody-${questionIndex}`}
                        className="text-right"
                      ></FormLabel>
                      <FormControl>
                        <Input id={`questionBody-${questionIndex}`} {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="ml-4 mt-4">
                  <span className="text-red-500 mr-1">*</span>
                  Options
                  {form
                    .getValues(`questions.${questionIndex}.options`)
                    ?.map((option, optionIndex) => (
                      <div key={optionIndex} className="mt-4">
                        <div className="flex items-center space-x-2">
                          <Input
                            type="text"
                            value={option.value}
                            onChange={(e) =>
                              handleOptionChange(
                                questionIndex,
                                optionIndex,
                                "value",
                                e.target.value,
                              )
                            }
                            placeholder={`Option ${optionIndex + 1}`}
                            required
                          />
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name={`questions.${questionIndex}.correctOption`}
                              checked={option.isCorrect}
                              onChange={() =>
                                handleOptionChange(
                                  questionIndex,
                                  optionIndex,
                                  "isCorrect",
                                  !option.isCorrect,
                                )
                              }
                            />
                            <Label className="ml-2">Correct</Label>

                            <Icon
                              name="TrashIcon"
                              className="text-red-500 ml-2 cursor-pointer"
                              onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  <Button
                    type="button"
                    className="mt-3"
                    onClick={() => handleAddOption(questionIndex)}
                  >
                    Add Option
                  </Button>
                </div>
              </div>
            ))}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SingleSelectQuiz;
