import { Icon } from "~/components/Icon";

import QuestionTitle from "./QuestionTitle";

import type { QuizLessonFormValues } from "../validators/quizLessonFormSchema";
import type { UseFormReturn } from "react-hook-form";
import { useCallback } from "react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "~/components/ui/tooltip";

type OpenQuestionProps = {
  form: UseFormReturn<QuizLessonFormValues>;
  questionIndex: number;
};

const OpenQuestion = ({ form, questionIndex }: OpenQuestionProps) => {
  const questionType = form.getValues(`questions.${questionIndex}.type`);

  const handleRemoveQuestion = useCallback(() => {
    const currentQuestions = form.getValues("questions") || [];
    const updatedQuestions = currentQuestions.filter((_, index) => index !== questionIndex);
    form.setValue("questions", updatedQuestions);
  }, [form, questionIndex]);

  return (
    <div className="border rounded-xl p-2 mt-3 border-gray-200 flex items-center justify-between">
      <div className="flex-1">
        <QuestionTitle form={form} questionIndex={questionIndex} questionType={questionType} />
      </div>

      <div className="flex items-center">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="group">
                <Icon
                  name="TrashIcon"
                  className="text-error-500 ml-2 mr-2 bg-error-50 cursor-pointer w-7 h-7 group-hover:text-white group-hover:bg-error-600 rounded-lg p-1"
                  onClick={handleRemoveQuestion}
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
  );
};

export default OpenQuestion;
