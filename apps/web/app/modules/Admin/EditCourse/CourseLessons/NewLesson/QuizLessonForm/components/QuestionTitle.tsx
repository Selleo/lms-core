import { AccordionTrigger } from "@radix-ui/react-accordion";

import { Icon } from "~/components/Icon";
import { Input } from "~/components/ui/input";

import { Question, QuestionIcons, QuestionType } from "../QuizLessonForm.types";
import type { QuizLessonFormValues } from "../validators/quizLessonFormSchema";
import type { UseFormReturn } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "~/components/ui/tooltip";
import { mapQuestionTypeToLabel } from "../../../CourseLessons.helpers";
import { useCallback } from "react";

interface QuestionTitleProps {
  questionIndex: number;
  questionType: QuestionType;
  form: UseFormReturn<QuizLessonFormValues>;
  isOpen?: boolean;
  handleToggle?: () => void;
  dragTrigger?: React.ReactNode;
  item: Question;
}

const QuestionTitle = ({
  questionIndex,
  questionType,
  form,
  isOpen,
  handleToggle,
  dragTrigger,
  item,
}: QuestionTitleProps) => {
  const questionTypeToIconMap: Record<QuestionType, QuestionIcons> = {
    [QuestionType.MULTIPLE_CHOICE]: QuestionIcons.MultiSelect,
    [QuestionType.SINGLE_CHOICE]: QuestionIcons.SingleSelect,
    [QuestionType.TRUE_OR_FALSE]: QuestionIcons.TrueOrFalse,
    [QuestionType.BRIEF_RESPONSE]: QuestionIcons.BriefResponse,
    [QuestionType.DETAILED_RESPONSE]: QuestionIcons.DetailedResponse,
    [QuestionType.PHOTO_QUESTION]: QuestionIcons.PhotoQuestion,
    [QuestionType.FILL_IN_THE_BLANKS_TEXT]: QuestionIcons.FillInTheBlanks,
    [QuestionType.FILL_IN_THE_BLANKS_DND]: QuestionIcons.FillInTheBlanks,
    [QuestionType.MATCH_WORDS]: QuestionIcons.MatchWords,
  };

  const isOpenQuestion =
    questionType === QuestionType.BRIEF_RESPONSE || questionType === QuestionType.DETAILED_RESPONSE;

  const getIconForQuestionType = (type: QuestionType): QuestionIcons => {
    return questionTypeToIconMap[type];
  };

  const handleRemoveQuestion = useCallback(() => {
    const currentQuestions = form.getValues("questions") || [];
    const updatedQuestions = currentQuestions.filter((_, index) => index !== questionIndex);
    form.setValue("questions", updatedQuestions, { shouldDirty: true });
  }, [form, questionIndex]);

  const handleOptionChange = useCallback(
    (value: string) => {
      form.setValue(`questions.${questionIndex}.title`, value, { shouldDirty: true });
    },
    [form, questionIndex, questionType],
  );

  return (
    <div className="flex items-center gap-2 p-2 border-neutral-200">
      {dragTrigger}
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="group">
              <Icon
                name={getIconForQuestionType(questionType)}
                className="w-5 h-5 text-primary-700"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            className="bg-black ml-4 text-white text-sm rounded shadow-md"
          >
            {mapQuestionTypeToLabel(questionType)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Input
        type="text"
        name={`questions.${questionIndex}.title`}
        value={item.title}
        onChange={(e) => handleOptionChange(e.target.value)}
        required
        className="flex-1"
      />

      {isOpenQuestion && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="group">
                <Icon
                  name="TrashIcon"
                  className="text-error-500 bg-error-50 ml-3 cursor-pointer w-7 h-7 group-hover:text-white group-hover:bg-error-600 rounded-lg p-1"
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
      )}

      {handleToggle && !isOpenQuestion && (
        <AccordionTrigger className="ml-2 mr-2 text-primary-800" onClick={handleToggle}>
          <Icon name={!isOpen ? "ArrowDown" : "ArrowUp"} />
        </AccordionTrigger>
      )}
    </div>
  );
};

export default QuestionTitle;
