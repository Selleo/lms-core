import { AccordionTrigger } from "@radix-ui/react-accordion";

import { Icon } from "~/components/Icon";
import { FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { QuestionIcons, QuestionType } from "../QuizLessonForm.types";
import type { QuizLessonFormValues } from "../validators/quizLessonFormSchema";
import type { UseFormReturn } from "react-hook-form";

interface QuestionTitleProps {
  questionIndex: number;
  questionType: QuestionType;
  form: UseFormReturn<QuizLessonFormValues>;
  isOpen?: boolean;
  handleToggle?: () => void;
}

const QuestionTitle = ({
  questionIndex,
  questionType,
  form,
  isOpen,
  handleToggle,
}: QuestionTitleProps) => {
  const questionTypeToIconMap: Record<QuestionType, QuestionIcons> = {
    [QuestionType.MULTIPLE_CHOICE]: QuestionIcons.MultiSelect,
    [QuestionType.SINGLE_CHOICE]: QuestionIcons.SingleSelect,
    [QuestionType.TRUE_OR_FALSE]: QuestionIcons.TrueOrFalse,
    [QuestionType.BRIEF_RESPONSE]: QuestionIcons.BriefResponse,
    [QuestionType.DETAILED_RESPONSE]: QuestionIcons.DetailedResponse,
    [QuestionType.PHOTO_QUESTION]: QuestionIcons.PhotoQuestion,
    [QuestionType.FILL_IN_THE_BLANKS]: QuestionIcons.FillInTheBlanks,
  };

  const getIconForQuestionType = (type: QuestionType): QuestionIcons => {
    return questionTypeToIconMap[type];
  };

  return (
    <div className="flex items-center gap-2 p-1">
      <Icon name="DragAndDropIcon" className="w-7 h-7" />
      <Icon name={getIconForQuestionType(questionType)} className="w-5 h-5 text-primary-700" />

      <FormField
        control={form.control}
        name={`questions.${questionIndex}.title`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input
                id={`title-${questionIndex}`}
                placeholder="Enter your question"
                {...field}
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {handleToggle && (
        <AccordionTrigger className="ml-auto" onClick={handleToggle}>
          <Icon name={!isOpen ? "ArrowDown" : "ArrowUp"} />
        </AccordionTrigger>
      )}
    </div>
  );
};

export default QuestionTitle;
