import { AccordionTrigger } from "@radix-ui/react-accordion";

import { Icon } from "~/components/Icon";
import { FormControl, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import type { QuestionIcons } from "../QuizLessonForm.types";
import type { QuizLessonFormValues } from "../validators/quizLessonFormChemat";
import type { UseFormReturn } from "react-hook-form";

interface QuestionTitleProps {
  questionIndex: number;
  questionType: "multiple_choice" | "single_choice" | "true_or_false";
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
  const getIconForQuestionType = (type: string): QuestionIcons => {
    switch (type) {
      case "multiple_choice":
        return "MultiSelect";
      case "single_choice":
        return "SingleSelect";
      case "true_or_false":
        return "TrueOrFalse";
      case "brief_response":
        return "BriefResponse";
      case "detailed_response":
        return "DetailedResponse";
      case "photo_question":
        return "PhotoQuestion";
      case "fill_in_the_blanks":
        return "FillInTheBlanks";
      default:
        return "TrueOrFalse";
    }
  };

  return (
    <div className="flex items-center gap-2 p-1">
      <Icon name="DragAndDropIcon" className="w-7 h-7" />
      <Icon name={getIconForQuestionType(questionType)} className="w-5 h-5" />

      <FormField
        control={form.control}
        name={`questions.${questionIndex}.questionTitle`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input
                id={`questionBody-${questionIndex}`}
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
          <Icon name={isOpen ? "ArrowDown" : "ArrowUp"} />
        </AccordionTrigger>
      )}
    </div>
  );
};

export default QuestionTitle;
