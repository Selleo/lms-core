import { Icon } from "~/components/Icon";

import QuestionTitle from "./QuestionTitle";

import type { QuizLessonFormValues } from "../validators/quizLessonFormChemat";
import type { UseFormReturn } from "react-hook-form";

type OpenQuestionProps = {
  form: UseFormReturn<QuizLessonFormValues>;
  questionIndex: number;
};

const OpenQuestion = ({ form, questionIndex }: OpenQuestionProps) => {
  const questionType = form.getValues(`questions.${questionIndex}.questionType`);

  const handleRemoveQuestion = () => {
    const currentQuestions = form.getValues("questions") || [];
    const updatedQuestions = currentQuestions.filter((_, index) => index !== questionIndex);
    form.setValue("questions", updatedQuestions);
  };

  return (
    <div className="border p-4 mt-4 border-gray-200 flex items-center justify-between">
      <div className="flex-1">
        <QuestionTitle form={form} questionIndex={questionIndex} questionType={questionType} />
      </div>

      <div className="flex items-center">
        <Icon
          name="TrashIcon"
          className="text-red-500 cursor-pointer ml-2 w-5 h-5"
          onClick={handleRemoveQuestion}
        />
      </div>
    </div>
  );
};

export default OpenQuestion;
